import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MyAttendance() {

  const [data, setData] = useState([]);

  const id = localStorage.getItem("user_id");

  useEffect(() => {

    api.get(`/attendance/student/${id}`)
      .then(res => setData(res.data));

  }, []);

  return (
    <div>

      <h3>My Attendance</h3>

      <ul>
        {data.map((d, i) => (
          <li key={i}>
            {d.date} - {d.method}
          </li>
        ))}
      </ul>

    </div>
  );
}
