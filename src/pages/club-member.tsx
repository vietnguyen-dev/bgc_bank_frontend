import { useState, ChangeEvent, SyntheticEvent } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [reason, setReason] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const queryClient = useQueryClient();

  const memberQuery = useQuery("club-member", async () => {
    const res = await controller.get(
      `/club-members/${user?.publicMetadata.club_id}/${id}`
    );
    return res.data;
  });

  const reasonsQuery = useQuery(["reasons", page], async () => {
    const res = await controller.get(`/reasons/${id}?page=${page}`);
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
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reasons"] });
    },
  });

  const deleteMember = useMutation({
    mutationFn: async () => {
      try {
        let res = await controller.delete(`/club-members/${id}`);
        return res.data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const postReason = useMutation({
    mutationFn: async (newReason: iNewReason) => {
      try {
        let res = await controller.post(`/reasons/${id}`, newReason);
        console.log(res.data);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club-member"] });
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

  const amountDisable =
    parseInt(amount!) >= -memberQuery.data?.amount &&
    memberQuery.data?.amount !== undefined &&
    parseInt(amount!) !== 0;
  const disableSubmit = reason !== "" && amountDisable;

  const disableDelete = name !== `delete`;

  console.log("whole", disableSubmit, "amountDisable", amountDisable);

  const handleReason = (e: ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const submitUpdate = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    postReason.mutate({
      reason: reason,
      clubMemberId: parseInt(id!),
      amountGiven: parseInt(amount!),
      newTotal: parseInt(amount!) + memberQuery.data.amount,
    });
    updateMember.mutate();
    setAmount("");
    setReason("");
  };

  const handleDelete = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteMember.mutate();
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
          <div className="flex justify-center">
            <p className="text-center mt-3 mr-4">Id: {memberQuery.data.id}</p>
            <p className="text-center mt-3">Grade: {memberQuery.data.grade}</p>
          </div>
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
          <input
            type="number"
            placeholder="Type amount here"
            className="input input-bordered input-accent w-full max-w-xs mt-3"
            max={20}
            min={-memberQuery.data.amount}
            value={amount!}
            onChange={handleAmount}
          />
          <input
            type="text"
            placeholder="Type reason here"
            className="input input-bordered input-accent w-full max-w-xs mt-3"
            value={reason}
            onChange={handleReason}
          />
          <div className="flex mt-3">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!disableSubmit}
            >
              Update
            </button>
          </div>
        </form>
        {reasonsQuery.data.length > 0 ? (
          <>
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
            <div className="join mt-5 flex justify-center">
              <button
                className="join-item btn"
                disabled={page === 1}
                onClick={() => setPage((prevPage) => prevPage - 1)}
              >
                «
              </button>
              <button className="join-item btn pointer-events-none">
                Page
              </button>
              <button
                className="join-item btn"
                onClick={() => setPage((prevPage) => prevPage + 1)}
                disabled={reasonsQuery.data.length < 5}
              >
                »
              </button>
            </div>
          </>
        ) : (
          <p className="text-center mt-10">No Data Available</p>
        )}
        <div className="flex justify-end">
          <button
            className="btn btn-active btn-secondary mr-3"
            onClick={() => {
              if (document) {
                (
                  document.getElementById("my_modal_4") as HTMLFormElement
                ).showModal();
              }
            }}
          >
            Change Clubs
          </button>
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
        </div>
        <dialog id="my_modal_3" className="modal">
          <form method="dialog" className="modal-box" onSubmit={handleDelete}>
            <h3 className="font-bold text-lg">
              Delete {memberQuery.data.first_name} {memberQuery.data.last_name}{" "}
            </h3>
            <p className="mt-3">Deleting a club member is permanent</p>
            <p className="mt-3">Type "delete" to delete this member</p>
            <input
              type="text"
              // placeholder={`Type ${memberQuery.data.first_name} ${memberQuery.data.last_name} here`}
              className="input input-bordered input-accent w-full mt-3"
              value={name}
              onChange={handleName}
            />
            <div className="modal-action">
              <button
                className="btn btn-warning"
                disabled={disableDelete}
                type="submit"
              >
                Delete Member
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  if (document) {
                    (
                      document.getElementById("my_modal_3") as HTMLFormElement
                    ).close();
                    setName("");
                  }
                }}
              >
                Close
              </button>
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <dialog id="my_modal_4" className="modal">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click outside to close</p>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </Page>
  );
};

export default ClubMemberPage;
