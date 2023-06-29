import { useState, ChangeEvent } from "react";

interface iSteps {
  step: number;
  continueStep: Function;
  resetStep: Function;
}

const StepsBeforeNewYear: React.FC<iSteps> = ({
  step,
  continueStep,
  resetStep,
}) => {
  const [confirm, setConfirm] = useState<string>("");

  const disabled = confirm !== "New School Year";

  const handleConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirm(e.target.value);
  };

  return (
    <>
      <ul className="steps">
        <li className="step step-primary">Are you sure?</li>
        <li className={`step ${step === 2 && "step-primary"}`}>Confirm</li>
      </ul>

      <div>
        {step === 1 && (
          <div className="mt-6">
            <p>Are you sure you want to upgrade the new school year?</p>
            <p>This action is undoable</p>
            <button
              className="btn btn-warning mt-3"
              type="button"
              onClick={() => continueStep()}
            >
              Continue
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="mt-6">
            <p>
              Type New School Year into the box below to enter the new school
              year
            </p>
            <input
              type="text"
              placeholder="Type New School Year here"
              className="input input-bordered input-accent w-full max-w-xs mt-4"
              onChange={handleConfirmChange}
            />
            <button
              className="btn btn-warning mt-3"
              disabled={disabled}
              onClick={() => continueStep()}
            >
              Enter New School Year
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const NewSchoolYear = () => {
  const [step, setStep] = useState<number>(1);

  const continueStep = () => {
    setStep(2);
  };

  const resetStep = () => {
    setStep(1);
  };

  return (
    <>
      <button
        className="btn btn-secondary ml-auto"
        onClick={() => {
          if (document) {
            (
              document.getElementById("my_modal_2") as HTMLFormElement
            ).showModal();
            resetStep();
          }
        }}
      >
        New School Year
      </button>
      <dialog id="my_modal_2" className="modal">
        <form method="dialog" className="modal-box">
          <h3 className="font-bold text-lg">New School Year</h3>
          <StepsBeforeNewYear
            step={step}
            continueStep={continueStep}
            resetStep={resetStep}
          />
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default NewSchoolYear;
