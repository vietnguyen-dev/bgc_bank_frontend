import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

interface iPage {
  children: React.ReactNode;
}

const Page: React.FC<iPage> = ({ children }) => {
  return (
    <>
      <header className="w-full flex btn-primary px-44 py-6">
        <h3 className="text-xl">
          <Link to="/dashboard">Welcome to BGC Bank Management</Link>
        </h3>
        <div className="ml-auto">
          <UserButton showName={true} />
        </div>
      </header>
      <div className="px-44 py-6 ">{children}</div>
    </>
  );
};

export default Page;
