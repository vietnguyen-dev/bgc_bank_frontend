import * as React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";

import Table from "../components/table";
import Statistics from "../components/statistics";

const Dashboard: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="m-4 px-44 py-6">
      <header className="w-full flex">
        <h3>Welcome to BGC Bank Management</h3>
        <div className="ml-auto">
          <UserButton showName={true} />
        </div>
      </header>
      <Statistics clubId={user?.publicMetadata.club_id} />
      <Table clubId={user?.publicMetadata.club_id} />
    </div>
  );
};

export default Dashboard;
