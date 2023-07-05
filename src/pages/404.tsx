import { Link } from "react-router-dom";

const Error: React.FC = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <p>Error: Page doesnt exist</p>
      <Link to="/">CLICK HERE TO GO BACK HOME</Link>
    </div>
  );
};

export default Error;
