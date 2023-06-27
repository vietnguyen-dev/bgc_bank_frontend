import { useState } from "react";
import { useQuery } from "react-query";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import controller from "../controllers";
import { iNeedClubId } from "./statistics";
import Loading from "./loading";
import NewMemberForm from "./form";

interface iClubMember {
  id: number;
  first_name: string;
  last_name: string;
  amount: number;
  grade: string;
  club_id: number;
  search_vector: string;
}

const columnHelper = createColumnHelper<iClubMember>();

const columns = [
  columnHelper.accessor("id", {
    header: () => <span>id</span>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("first_name", {
    header: () => <span>First Name</span>,
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("last_name", {
    id: "lastName",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("amount", {
    header: () => "Amount",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("grade", {
    header: () => <span>Grade</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("club_id", {
    header: () => <span>Clud Id</span>,
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
];

const Table: React.FC<iNeedClubId> = ({ clubId }) => {
  // const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { isLoading, error, data } = useQuery(
    ["club-members", page],
    async () => {
      try {
        let res = await controller.get(`/club-members/${clubId}?page=${page}`);
        console.log(res.data);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    }
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <Loading />;

  if (error) return <p>error</p>;

  return (
    <div className="my-4 mt-10">
      <div className="flex">
        <input
          type="text"
          placeholder="Enter Name Here"
          className="input input-bordered input-accent w-full max-w-xs"
          // onChange={setSearch}
          // value={search}
        />
        <button
          className="btn btn-primary ml-auto"
          onClick={() => {
            if (document) {
              (
                document.getElementById("my_modal_1") as HTMLFormElement
              ).showModal();
            }
          }}
        >
          New Club Member
        </button>
        <dialog id="my_modal_1" className="modal">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Add New Club Member</h3>
            <NewMemberForm />
            <p className="py-4">
              Press ESC key or click the button below to close
            </p>
            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </div>
          </form>
        </dialog>
      </div>
      <div className="overflow-x-auto mt-8">
        <table className="table table-zebra">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
            Page {page}
          </button>
          <button
            className="join-item btn"
            onClick={() => setPage((prevPage) => prevPage + 1)}
            disabled={data.length < 10}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
