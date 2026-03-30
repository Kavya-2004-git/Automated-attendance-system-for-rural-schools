import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { logout } from "../utils/storage";

import AddStudent from "../modules/student/AddStudent";
import AttendancePage from "../modules/attendance/AttendancePage";
import StudentList from "../modules/student/StudentList";
import ResetStudentPassword from "../pages/reset_student_password";

import "../styles/teacher.css";

export default function TeacherDashboard() {

  const [page, setPage] = useState("DASH");

  const [stats, setStats] = useState(null);

  const [notice, setNotice] = useState("");

  const [activities, setActivities] = useState([]);
  const [subs, setSubs] = useState([]);

  const [activeId,setActiveId]=useState(null);

  const [actForm, setActForm] = useState({
    title:"",
    desc:"",
    class:"",
    section:""
  });

  const nav = useNavigate();



  // ================= LOAD =================
  useEffect(()=>{
    loadStats();
    loadActivities();
  },[]);



  const loadStats = ()=>{
    api.get("/teacher/stats")
      .then(res=>setStats(res.data));
  };


  const loadActivities = ()=>{
    api.get("/teacher/activities")
      .then(res=>setActivities(res.data));
  };


  const loadSubs = (id)=>{

    setActiveId(id);

    api.get(`/teacher/activity/${id}/submissions`)
      .then(res=>setSubs(res.data));
  };



  // ================= LOGOUT =================
  const out = ()=>{
    logout();
    nav("/");
  };



  // ================= NOTICE =================
  const sendNotice = async()=>{

    if(!notice) return alert("Enter notice");

    try{
      await api.post("/teacher/notice",{message:notice});
      alert("Sent ✅");
      setNotice("");
    }catch{
      alert("Failed ❌");
    }
  };



  // ================= CREATE ACT =================
  const createActivity = async()=>{

    if(!actForm.title || !actForm.class || !actForm.section){
      return alert("Fill all fields");
    }

    try{

      await api.post("/teacher/activity",{
        title:actForm.title,
        description:actForm.desc,
        class:actForm.class,
        section:actForm.section
      });

      alert("Activity Created ✅");

      setActForm({
        title:"",
        desc:"",
        class:"",
        section:""
      });

      loadActivities();

    }catch{
      alert("Failed ❌");
    }
  };



  // ================= VERIFY =================
  const verify = async(id,status)=>{

    try{

      await api.put(`/teacher/submission/${id}/status`,{
        status
      });

      alert("Updated");

      loadSubs(activeId);

    }catch{
      alert("Failed");
    }
  };






  return (

    <div className="teacher-layout">


{/* ================= SIDEBAR ================= */}
<div className="sidebar">

<h2 className="logo">📘 SmartAttend</h2>

<button className={page==="DASH"?"active":""}
onClick={()=>setPage("DASH")}>
📊 Dashboard
</button>

<button className={page==="ADD"?"active":""}
onClick={()=>setPage("ADD")}>
➕ Add Student
</button>

<button className={page==="ATT"?"active":""}
onClick={()=>setPage("ATT")}>
📷 Attendance
</button>

<button className={page==="ACT"?"active":""}
onClick={()=>setPage("ACT")}>
📝 Activities
</button>

<button className={page==="LIST"?"active":""}
onClick={()=>setPage("LIST")}>
📋 Students
</button>

<button className={page==="NOTICE"?"active":""}
onClick={()=>setPage("NOTICE")}>
📢 Notice
</button>

<button className={page==="RES"?"active":""}
onClick={()=>setPage("RES")}>
RESET STU PWD
</button>

<button className="logout" onClick={out}>
🚪 Logout
</button>

</div>




{/* ================= MAIN ================= */}
<div className="main">


{/* TOPBAR */}
<div className="topbar">

<h2>Teacher Panel</h2>

<div className="profile">
👨‍🏫 Teacher
</div>

</div>




{/* ================= CONTENT ================= */}
<div className="content">




{/* ================= DASH ================= */}
{page==="DASH" && stats && (

<div className="dashboard">

<div className="stats">

<div className="stat-card green">
<h3>{stats.students}</h3>
<p>Students</p>
</div>

<div className="stat-card blue">
<h3>{stats.rate}%</h3>
<p>Attendance</p>
</div>

<div className="stat-card orange">
<h3>{stats.low}</h3>
<p>Low</p>
</div>

<div className="stat-card red">
<h3>{activities.length}</h3>
<p>Activities</p>
</div>

</div>

</div>

)}




{/* ================= ADD STUDENT ================= */}
{page==="ADD" && <AddStudent/>}




{/* ================= ATT ================= */}
{page==="ATT" && <AttendancePage/>}

{page==="RES" && <ResetStudentPassword/>}


{/* ================= STUDENTS ================= */}
{page==="LIST" && <StudentList/>}




{/* ================= NOTICE ================= */}
{page==="NOTICE" && (

<div className="card">

<h2>📢 Send Notice</h2>

<textarea
rows="5"
value={notice}
onChange={e=>setNotice(e.target.value)}
/>

<button className="btn" onClick={sendNotice}>
Send
</button>

</div>

)}






{/* ================= ACTIVITIES ================= */}
{page==="ACT" && (

<div>



{/* CREATE */}
<div className="card">

<h3>Create Activity</h3>

<input
placeholder="Title"
value={actForm.title}
onChange={e=>setActForm({...actForm,title:e.target.value})}
/>

<textarea
placeholder="Description"
value={actForm.desc}
onChange={e=>setActForm({...actForm,desc:e.target.value})}
/>

<input
placeholder="Class"
value={actForm.class}
onChange={e=>setActForm({...actForm,class:e.target.value})}
/>

<input
placeholder="Section"
value={actForm.section}
onChange={e=>setActForm({...actForm,section:e.target.value})}
/>

<button className="btn" onClick={createActivity}>
Create
</button>

</div>




{/* LIST */}
<div className="card">

<h3>Activities</h3>

<table>

<thead>
<tr>
<th>Title</th>
<th>Class</th>
<th>Section</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{activities.map(a=>(

<tr key={a.id}>

<td>{a.title}</td>
<td>{a.class}</td>
<td>{a.section}</td>

<td>
<button
className="btn"
onClick={()=>loadSubs(a.id)}
>
Submissions
</button>
</td>

</tr>

))}

</tbody>

</table>

</div>




{/* SUBMISSIONS */}
{subs.length>0 && (

<div className="card">

<h3>Submissions</h3>

<table>

<thead>
<tr>
<th>Student</th>
<th>Roll</th>
<th>Photo</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{subs.map(s=>(

<tr key={s.id}>

<td>{s.name}</td>
<td>{s.roll}</td>

<td>
<a
  href={`http://127.0.0.1:5000/${s.photo}`}
  target="_blank"
  rel="noreferrer"
>
  View
</a>

</td>

<td>{s.status}</td>

<td>

<button
onClick={()=>verify(s.id,"APPROVED")}
className="btn"
>
✔
</button>

<button
onClick={()=>verify(s.id,"REJECTED")}
className="danger-btn"
>
❌
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)}

</div>

)}




</div>

</div>

</div>

  );
}
