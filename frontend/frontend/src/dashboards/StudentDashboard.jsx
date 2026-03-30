import { useEffect, useState } from "react";
import api from "../services/api";
import { logout } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function StudentDashboard(){

  const [data,setData]=useState(null);
  const [acts,setActs]=useState([]);
  const [history,setHistory]=useState([]);
  const [files,setFiles]=useState({});
  // ADD THIS STATE AT TOP
const [page, setPage] = useState("PROFILE");

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [photo,setPhoto]=useState(null);
  const [loading,setLoading]=useState(false);

  const [notices,setNotices]=useState([]);
  const [showNotice,setShowNotice]=useState(false);

  // ================= COMPLAINTS =================
const [complaintText, setComplaintText] = useState("");
const [complaints, setComplaints] = useState([]);
const [loadingComplaint, setLoadingComplaint] = useState(false);


  const nav=useNavigate();



  // ================= LOAD =================
  useEffect(()=>{
    loadAll();
  },[]);


  const loadAll=()=>{
    loadData();
    loadActs();
    loadHistory();
    loadNotices();
    loadComplaints();
  };


  const loadData=()=>{
    api.get("/student/dashboard")
      .then(res=>{
        setData(res.data);
        setEmail(res.data.email || "");
      })
      .catch(()=>doLogout());
  };


  const loadActs=()=>{
    api.get("/student/activities")
      .then(res=>setActs(res.data));
  };


  const loadHistory=()=>{
    api.get("/student/activity/history")
      .then(res=>setHistory(res.data));
  };


  const loadNotices=()=>{
    api.get("/student/notices")
      .then(res=>setNotices(res.data));
  };

  const loadComplaints = () => {
  api.get("/student/complaints")
    .then(res => setComplaints(res.data))
    .catch(() => {});
};




  // ================= LOGOUT =================
  const doLogout=()=>{
    logout();
    nav("/");
  };



  // ================= PROFILE UPDATE =================
  const updateProfile = async()=>{

    if(!email && !password && !photo){
      alert("Nothing to update");
      return;
    }

    const fd=new FormData();

    if(email) fd.append("email",email);
    if(password) fd.append("password",password);
    if(photo) fd.append("photo",photo);

    try{

      setLoading(true);

      await api.post("/student/update",fd);

      alert("Profile Updated ✅");

      setPassword("");
      setPhoto(null);

      loadData();

    }catch{
      alert("Update Failed ❌");
    }

    setLoading(false);
  };
  const resolveComplaint = async (id) => {
  try {

    await api.put(`/student/complaint/${id}/resolve`);

    alert("Marked as Resolved ✅");

    loadComplaints(); // reload complaints

  } catch {

    alert("Failed ❌");

  }
};


  // ================= SEND COMPLAINT =================
const sendComplaint = async () => {

  if(!complaintText.trim()){
    alert("Write your complaint first");
    return;
  }

  try{

    setLoadingComplaint(true);

    await api.post("/student/complaint", {
      message: complaintText
    });

    alert("Complaint sent ✅");

    setComplaintText("");

    loadComplaints();

  }catch{

    alert("Failed ❌");

  }

  setLoadingComplaint(false);
};


  // ================= SUBMIT ACTIVITY =================
  const submit=async(id)=>{

    if(!files[id]) return alert("Select photo first");

    const fd=new FormData();
    fd.append("photo",files[id]);

    try{

      await api.post(`/student/activity/${id}/submit`,fd);

      alert("Submitted ✅");

      setFiles(prev=>{
        const copy={...prev};
        delete copy[id];
        return copy;
      });

      loadAll();

    }catch{
      alert("Already submitted ❌");
    }
  };



  // ================= CSV =================
  const downloadCSV = async () => {

    try {

      const res = await api.get("/student/attendance/csv", {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = "attendance.csv";

      link.click();

    } catch {
      alert("Download failed");
    }
  };



  if(!data) return <h3>Loading...</h3>;



  // check submitted
  const isSubmitted=(id)=>{
    return history.some(h=>h.activity_id===id);
  };


  // attendance %
  const totalDays = data.history.length;
  const presentDays = data.total;

  const percent = totalDays>0
    ? Math.round((presentDays/totalDays)*100)
    : 0;




    return (

      <div className="student-layout">
      
        {/* ================= SIDEBAR ================= */}
        <div className="student-sidebar">
      
          <h2>🎓 Student</h2>
      
          <button onClick={() => setPage("PROFILE")} className={page==="PROFILE"?"active":""}>
            👤 Profile
          </button>
      
          <button onClick={() => setPage("ATTENDANCE")} className={page==="ATTENDANCE"?"active":""}>
            📊 Attendance
          </button>
      
          <button onClick={() => setPage("ACTIVITY")} className={page==="ACTIVITY"?"active":""}>
            📝 Activities
          </button>
      
          <button onClick={() => setPage("COMPLAINT")} className={page==="COMPLAINT"?"active":""}>
            📩 Complaints
          </button>
      
          <button onClick={doLogout} className="logout-btn">
            🚪 Logout
          </button>
      
        </div>
      
      
        {/* ================= MAIN ================= */}
        <div className="student-main">
      
          {/* HEADER */}
          <div className="student-header">
            <h2>🎓 Student Dashboard</h2>
      
            <div className="header-right">
              <div className="notify-icon" onClick={()=>setShowNotice(true)}>
                🔔
                {notices.length>0 && (
                  <span className="notify-count">{notices.length}</span>
                )}
              </div>
            </div>
          </div>
      
      
          {/* NOTICE */}
          {showNotice && (
            <div className="notice-popup">
              <div className="notice-box">
                <h3>Alerts</h3>
      
                {notices.length===0 && <p>No notices</p>}
      
                {notices.map((n,i)=>(
                  <div key={i} className="notice-item">
                    <p>{n.msg}</p>
                    <span>{n.date}</span>
                  </div>
                ))}
      
                <button className="btn" onClick={()=>setShowNotice(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
      
      
          {/* ================= PROFILE ================= */}
          {page==="PROFILE" && (
            <div className="card">
      
              <h3>👤 Profile</h3>
      
              <div className="profile-box">
      
                <div className="profile-left">
                  {data.photo ? (
                    <img src={`http://127.0.0.1:5000/${data.photo}`} className="profile-img" />
                  ) : (
                    <div className="no-img">No Photo</div>
                  )}
      
                  <input type="file" onChange={e=>setPhoto(e.target.files[0])} />
                </div>
      
                <div className="profile-details">
      
                  <p><b>Name:</b> {data.name}</p>
                  <p><b>Roll:</b> {data.roll}</p>
                  <p><b>Class:</b> {data.class}</p>
                  <p><b>Section:</b> {data.section}</p>
      
                  <label>Email</label>
                  <input value={email} onChange={e=>setEmail(e.target.value)} />
      
                  <label>New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    placeholder="Leave blank if no change"
                  />
      
                  <button className="btn" onClick={updateProfile} disabled={loading}>
                    {loading ? "Saving..." : "Save Profile"}
                  </button>
      
                </div>
      
              </div>
            </div>
          )}
      
      
          {/* ================= ATTENDANCE ================= */}
          {page==="ATTENDANCE" && (
            <>
              <div className="card">
                <h3>📊 Attendance Overview</h3>
      
                <div className="stats-box">
                  <div className="stat">
                    <h3>{totalDays}</h3>
                    <p>Total Days</p>
                  </div>
      
                  <div className="stat">
                    <h3>{presentDays}</h3>
                    <p>Present</p>
                  </div>
      
                  <div className="stat">
                    <h3>{percent}%</h3>
                    <p>Percentage</p>
                  </div>
                </div>
      
                <button className="btn" onClick={downloadCSV}>
                  📥 Download Report
                </button>
              </div>
      
              <div className="card">
                <h3>📊 Attendance Records</h3>
      
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
      
                  <tbody>
                  {data?.history?.length > 0 ? (
  data.history.map((r,i)=>(
    <tr key={i}>
      <td>{r.date}</td>
      <td>{r.time}</td>
      <td>{r.method}</td>
      <td style={{color:"green"}}>{r.status}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="4">No attendance records</td>
  </tr>
)}
                  </tbody>
                </table>
              </div>
            </>
          )}
      
      
          {/* ================= ACTIVITIES ================= */}
          {page==="ACTIVITY" && (
            <div className="card">
              <h3>📝 Activities</h3>
      
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Upload</th>
                  </tr>
                </thead>
      
                <tbody>
                  {acts.map(a=>{
                    const submitted=isSubmitted(a.id);
                    const hist=history.find(h=>h.activity_id===a.id);
      
                    return(
                      <tr key={a.id}>
                        <td>{a.title}</td>
                        <td>{a.description}</td>
                        <td>{a.date}</td>
      
                        <td>
  {submitted ? (
    <span style={{
      color:
        hist.status === "APPROVED" ? "green" :
        hist.status === "REJECTED" ? "red" :
        "orange"
    }}>
      {hist.status}
    </span>
  ) : "PENDING"}
</td>

<td>
  {submitted ? (

    hist.status === "REJECTED" ? (
      <>
        <input
          type="file"
          onChange={e=>setFiles({...files,[a.id]:e.target.files[0]})}
        />
        <button className="btn" onClick={()=>submit(a.id)}>
          Resubmit
        </button>
      </>
    ) : (
      <span style={{color:"green"}}>Submitted</span>
    )

  ) : (
    <>
      <input
        type="file"
        onChange={e=>setFiles({...files,[a.id]:e.target.files[0]})}
      />
      <button className="btn" onClick={()=>submit(a.id)}>
        Submit
      </button>
    </>
  )}
</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      
      
          {/* ================= COMPLAINT ================= */}
          {page==="COMPLAINT" && (
            <div className="card">
      
              <h3>📩 Complaints</h3>
      
              <textarea
                rows="4"
                placeholder="Write your issue here..."
                value={complaintText}
                onChange={e=>setComplaintText(e.target.value)}
              />
      
              <button
                className="btn"
                onClick={sendComplaint}
                disabled={loadingComplaint}
              >
                {loadingComplaint ? "Sending..." : "Send Complaint"}
              </button>
      
              <hr/>
      
              <table>
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
      
                <tbody>
                  {complaints.map(c=>(
                    <tr key={c.id}>
                      <td>{c.msg}</td>
                      <td>{c.status}</td>
                      <td>{c.date}</td>
                      <td>
                        {c.status !== "RESOLVED" ? (
                          <button className="btn" onClick={() => resolveComplaint(c.id)}>
                            Mark as Resolved
                          </button>
                        ) : (
                          <span style={{color:"green"}}>✅ Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
      
            </div>
          )}
      
        </div>
      
      </div>
      
      );}