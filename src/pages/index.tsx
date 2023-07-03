import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

interface iPage {
  children: React.ReactNode;
}

const Page: React.FC<iPage> = ({ children }) => {
  const { user } = useUser();
  return (
    <>
      <header className="w-full flex bg-blue-700 px-44 py-6">
        <h3 className="text-xl text-white">
          <Link to="/">Welcome to BGC Bank Management</Link>
        </h3>
        <div className="ml-auto flex items-center">
          <p className="mr-3 text-white">
            {user?.firstName} {user?.lastName}
          </p>
          <UserButton />
        </div>
      </header>
      <div className="px-44 py-6 ">{children}</div>
    </>
  );
};

export default Page;
