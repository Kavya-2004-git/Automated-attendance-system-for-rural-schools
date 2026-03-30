import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StudentReport() {

  const [list, setList] = useState([]);


  useEffect(() => {

    api.get("/student/attendance")
      .then(res => setList(res.data));

  }, []);


  const download = () => {

    let csv = "Date,Time,Status\n";

    list.forEach(a => {
      csv += `${a.day},${a.time},${a.status}\n`;
    });

    const blob = new Blob([csv]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
  };


  return (
    <div>

      <h3>Attendance</h3>

      <button onClick={download}>
        Download CSV
      </button>

      <br /><br />

      <table border="1" cellPadding="6">

        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {list.map((a, i) => (
            <tr key={i}>
              <td>{a.day}</td>
              <td>{a.time}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
