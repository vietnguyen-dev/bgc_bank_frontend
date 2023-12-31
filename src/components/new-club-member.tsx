// import { iNewClubMember } from "./table";
import { SyntheticEvent, useState, ChangeEvent } from "react";
import { useUser } from "@clerk/clerk-react";

interface iNewClubMemberForm {
  addNewMember: Function;
}

const NewClubMember: React.FC<iNewClubMemberForm> = ({ addNewMember }) => {
  const { user } = useUser();
  const [first, setFirst] = useState<string>("");
  const [last, setLast] = useState<string>("");
  const [grade, setGrade] = useState<string>("Choose Grade");

  const addMember = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      firstName: first,
      lastName: last,
      grade: grade,
      clubId: user?.publicMetadata.club_id,
    };
    addNewMember(data);
    close();
  };

  const handleFirst = (e: ChangeEvent<HTMLInputElement>) => {
    setFirst(e.target.value);
  };

  const handleLast = (e: ChangeEvent<HTMLInputElement>) => {
    setLast(e.target.value);
  };

  const handleGrade = (e: ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.target.value);
  };

  const close = () => {
    if (document) {
      (document.getElementById("my_modal_1") as HTMLFormElement).close();
    }
  };

  const disableSubmit = grade === "Choose Grade" || first === "" || last === "";

  return (
    <>
      <button
        className="btn btn-primary mr-3"
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
        <form method="dialog" className="modal-box" onSubmit={addMember}>
          <h3 className="font-bold text-lg">Add New Club Member</h3>
          <input
            type="text"
            name="firstName"
            placeholder="Type first name here"
            className="input input-bordered input-accent w-full mt-6"
            value={first}
            onChange={handleFirst}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Type last name here"
            className="input input-bordered input-accent w-full mt-4"
            value={last}
            onChange={handleLast}
          />
          <select
            className="select select-accent w-full mt-4"
            value={grade}
            onChange={handleGrade}
          >
            <option disabled>Choose Grade</option>
            <option value="K">K</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={disableSubmit}
            >
              Add New Member
            </button>
            <button className="btn" onClick={close}>
              Close
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default NewClubMember;
