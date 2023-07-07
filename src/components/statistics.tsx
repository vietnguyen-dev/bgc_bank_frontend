import { useQuery } from "react-query";

import controller from "../controller";
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

  const date = new Date();

  if (isLoading) return <Loading />;

  if (error) return <p>error</p>;

  return (
    <div className="flex gap-4 mt-10">
      <div className="card w-62 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Total in Circulation</h2>
          <div className="stat-value text-primary">${data.total}</div>
          <p>
            as of {date.getMonth()}/{date.getDate()}/{date.getFullYear()}
          </p>
        </div>
      </div>
      <div className="card w-52 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Average</h2>
          <div className="stat-value text-primary">${data.average}</div>
          <p>Per Club Member</p>
        </div>
      </div>
      <div className="card w-72 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Members with None</h2>
          <div className="stat-value text-secondary">{data.withNone}</div>
          <p>
            as of {date.getMonth()}/{date.getDate()}/{date.getFullYear()}
          </p>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{"With Less than Average"}</h2>
          <div className="stat-value text-secondary">{data.lessAverage}</div>
          <p>
            as of {date.getMonth()}/{date.getDate()}/{date.getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
