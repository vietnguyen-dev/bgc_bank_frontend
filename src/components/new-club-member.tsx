const NewClubMember = () => {
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
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">Add New Club Member</h3>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">What is your name?</span>
              <span className="label-text-alt">Top Right label</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs input-sm"
            />
            <label className="label">
              <span className="label-text-alt">Bottom Left label</span>
              <span className="label-text-alt">Bottom Right label</span>
            </label>
          </div>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default NewClubMember;
