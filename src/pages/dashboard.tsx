import * as React from "react";
import { useUser } from "@clerk/clerk-react";

import Table from "../components/table";
import Statistics from "../components/statistics";
import Page from ".";

const Dashboard: React.FC = () => {
  const { user } = useUser();

  return (
    <Page>
      <Statistics clubId={user?.publicMetadata.club_id} />
      <Table clubId={user?.publicMetadata.club_id} />
    </Page>
  );
};

export default Dashboard;
