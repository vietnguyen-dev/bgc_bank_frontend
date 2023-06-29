import { useState, ChangeEvent } from "react";
import { useQuery, useMutation } from "react-query";

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
import NewClubMember from "./new-club-member";
import NewSchoolYear from "./new-school-year";

interface iClubMember {
  id: number;
  first_name: string;
  last_name: string;
  amount: number;
  grade: string;
  club_id: number;
  search_vector: string;
}

export interface iNewClubMember {
  first_name: string;
  last_name: string;
  amount: number;
  grade: string;
  club_id: number;
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
  const [search, setSearch] = useState<string>("");
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
  const postMember = useMutation({
    mutationFn: async (newMember: iNewClubMember) => {
      try {
        let res = await controller.post(`/club-members/`, newMember);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const addNewClubMember = (member: iNewClubMember) => {
    postMember.mutate(member);
  };

  if (isLoading) return <Loading />;

  if (error) return <p>error</p>;

  return (
    <div className="my-4 mt-10">
      <div className="flex">
        <input
          type="text"
          placeholder="Enter Name Here"
          className="input input-bordered input-accent w-full max-w-xs"
          value={search}
          onChange={handleSearch}
        />
        <div className="ml-auto">
          <NewClubMember addNewMember={addNewClubMember} />
          <NewSchoolYear />
        </div>
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
