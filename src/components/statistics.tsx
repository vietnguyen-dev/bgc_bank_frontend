import { useQuery } from "react-query";

import controller from "../controllers";
import Loading from "./loading";

export interface iNeedClubId {
  clubId: number | unknown;
}

const Statistics: React.FC<iNeedClubId> = ({ clubId }) => {
  const { isLoading, error, data } = useQuery("statistics", async () => {
    try {
      let res = await controller.get(`/statistics/${clubId}`);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  });

  if (isLoading) return <Loading />;

  if (error) return <p>error</p>;

  return (
    <div className="flex gap-4 justify-end mt-10">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Given this Month</h2>
          <div className="stat-value text-primary">25.6K</div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Given Today</h2>
          <div className="stat-value text-secondary">25.6K</div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Total </h2>
          <div className="stat-value text-primary">${data.total}</div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Average</h2>
          <div className="stat-value text-secondary">${data.average}</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
