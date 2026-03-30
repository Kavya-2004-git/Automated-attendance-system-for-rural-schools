import { useEffect,useState } from "react";
import api from "../../services/api";

export default function StudentAttendance(){

  const [list,setList]=useState([]);

  useEffect(()=>{
    api.get("/student/attendance")
    .then(res=>setList(res.data));
  },[]);

  return(

    <div>

      <h3>Attendance</h3>

      <a href="http://127.0.0.1:5000/student/attendance/csv">
        Download CSV
      </a>

      <table>

        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Method</th>
        </tr>

        {list.map((r,i)=>(
          <tr key={i}>
            <td>{r.date}</td>
            <td>{r.time}</td>
            <td>{r.method}</td>
          </tr>
        ))}

      </table>

    </div>
  );
}
