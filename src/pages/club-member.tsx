import { useState, ChangeEvent, SyntheticEvent } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import controller from "../controller";
import Loading from "../components/loading";
import Page from ".";

interface iNewReason {
  reason: string;
  clubMemberId: number;
  amountGiven: number;
  newTotal: number;
}

interface iReason {
  id: number;
  reason: string;
  club_member_id: number;
  amount_given: number;
  new_total: number;
  date_created: Date;
}

const columnHelper = createColumnHelper<iReason>();

const columns = [
  columnHelper.accessor("id", {
    header: () => <span>id</span>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("reason", {
    header: () => <span>Reason</span>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("club_member_id", {
    id: "clubMemberId",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Member Id</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("amount_given", {
    header: () => "Amount Given",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("new_total", {
    header: () => <span>New Total</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("date_created", {
    header: () => <span>Date Given</span>,
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
];

const ClubMemberPage: React.FC = () => {
  const { user } = useUser();
  let { id } = useParams();

  const [reason, setReason] = useState<string>("");
  const [amount, setAmount] = useState<string>("Choose Amount");

  const memberQuery = useQuery("club-member", async () => {
    const res = await controller.get(
      `/club-members/${user?.publicMetadata.club_id}/${id}`
    );
    return res.data;
  });
  const reasonsQuery = useQuery("reasons", async () => {
    const res = await controller.get(`/reasons/${id}`);
    console.log(res.data);
    return res.data;
  });
  const updateMember = useMutation({
    mutationFn: async () => {
      try {
        let res = await controller.put(`/club-members/${id}?amount=${amount}`);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
    onSuccess: () => {
      reasonsQuery.refetch();
    },
  });
  const postReason = useMutation({
    mutationFn: async (newReason: iNewReason) => {
      try {
        let res = await controller.post(`/reasons/${id}`, newReason);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
    onSuccess: () => {
      memberQuery.refetch();
    },
  });

  const data = reasonsQuery.data;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const date = new Date();

  const disableSubmit = reason === "" || amount === "Choose Amount";

  const handleReason = (e: ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  const handleAmount = (e: ChangeEvent<HTMLSelectElement>) => {
    setAmount(e.target.value);
  };

  const submitUpdate = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMember.mutate();
    postReason.mutate({
      reason: reason,
      clubMemberId: parseInt(id!),
      amountGiven: parseInt(amount),
      newTotal: parseInt(amount) + memberQuery.data.amount,
    });
    setAmount("Choose Amount");
    setReason("");
  };

  if (memberQuery.isLoading || reasonsQuery.isLoading) {
    return <Loading />;
  }

  if (memberQuery.isError || reasonsQuery.isError) {
    return <p>Error loading data</p>;
  }

  return (
    <Page>
      <div>
        <div className="mt-10">
          <h1 className="text-3xl text-center">
            {memberQuery.data.first_name} {memberQuery.data.last_name}
          </h1>
          <p className="text-center mt-3">Grade: {memberQuery.data.grade}</p>
          <h2 className="text-center text-6xl mt-16">
            {memberQuery.data.amount}
          </h2>
          <p className="text-center mt-3">
            CB as of {date.getMonth()}/{date.getDate()}/{date.getFullYear()}
          </p>
        </div>
        <form
          className="flex justify-center items-center flex-col mt-6"
          onSubmit={submitUpdate}
        >
          <select
            className="select select-accent w-full max-w-xs"
            value={amount}
            onChange={handleAmount}
            placeholder="Choose Amount"
          >
            <option disabled>Choose Amount</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={5}>4</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <input
            type="text"
            placeholder="Type reason here"
            className="input input-bordered input-accent w-full max-w-xs mt-3"
            value={reason}
            onChange={handleReason}
          />
          <button
            className="btn btn-primary mt-3"
            type="submit"
            disabled={disableSubmit}
          >
            Update
          </button>
        </form>
        {reasonsQuery.data.length > 0 ? (
          <table className="table table-zebra mt-10 shadow-2xl">
            {/* head */}
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-10">no data available</p>
        )}
        <div className="w-full">
          <div className="join mt-5 flex justify-center">
            <button
              className="join-item btn"
              // disabled={page === 1}
              // onClick={() => setPage((prevPage) => prevPage - 1)}
            >
              «
            </button>
            <button className="join-item btn pointer-events-none">Page</button>
            <button
              className="join-item btn"
              // onClick={() => setPage((prevPage) => prevPage + 1)}
              disabled={data.length < 10}
            >
              »
            </button>
          </div>
          <div className="ml-auto">
            <button
              className="btn btn-warning"
              onClick={() => {
                if (document) {
                  (
                    document.getElementById("my_modal_3") as HTMLFormElement
                  ).showModal();
                }
              }}
            >
              DELETE
            </button>
            <dialog id="my_modal_3" className="modal">
              <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg">
                  Delete {memberQuery.data.first_name}{" "}
                  {memberQuery.data.last_name}{" "}
                </h3>
                <div className="modal-action">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </div>
              </form>
            </dialog>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ClubMemberPage;
