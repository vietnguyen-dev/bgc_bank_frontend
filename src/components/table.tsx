import { useState, ChangeEvent, SyntheticEvent } from "react";
import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import controller from "../controller";
import { iNeedClubId } from "./statistics";
import Loading from "./loading";
import NewClubMember from "./new-club-member";

export interface iClubMember {
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
    // id: "lastName",
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
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);

  const { isLoading, error, data, refetch } = useQuery(
    ["club-members", page, sorting, searchValue],
    async () => {
      try {
        let res = await controller.get(`/club-members/${clubId}`, {
          params: {
            page: page,
            sortField: sorting[0]?.id || "id",
            sortDirection: sorting[0]?.desc ? "DESC" : "ASC" || "ASC",
            search: searchValue.length > 0 ? searchValue : null,
          },
        });
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
    onSuccess: () => {
      refetch();
    },
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const submitSearch = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchValue(search);
  };

  const addNewClubMember = (member: iNewClubMember) => {
    postMember.mutate(member);
  };

  if (isLoading) return <Loading />;

  if (error) return <p>error</p>;

  return (
    <div className="my-4 mt-10">
      <div className="flex">
        <form onSubmit={submitSearch}>
          <input
            type="text"
            placeholder="Search Name Here"
            className="input input-bordered input-accent w-full"
            value={search}
            onChange={handleSearch}
          />
        </form>
        <div className="ml-auto">
          <NewClubMember addNewMember={addNewClubMember} />
        </div>
      </div>
      <div className="overflow-x-auto mt-8">
        <table className="table table-zebra shadow-xl">
          {/* head */}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover"
                onClick={() => {
                  navigate(`/club-member/${row.original.id}`);
                }}
              >
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
            disabled={data?.length < 10}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
