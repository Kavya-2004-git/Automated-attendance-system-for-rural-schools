import { useEffect, useState } from "react";
import api from "../services/api";
import { logout } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import "../styles/student.css";

export default function StudentDashboard(){

  const [activeTab,setActiveTab]=useState("profile");

  const [data,setData]=useState(null);
  const [acts,setActs]=useState([]);
  const [history,setHistory]=useState([]);
  const [files,setFiles]=useState({});

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [photo,setPhoto]=useState(null);
  const [loading,setLoading]=useState(false);

  const [notices,setNotices]=useState([]);
  const [showNotice,setShowNotice]=useState(false);

  const [complaintText,setComplaintText]=useState("");
  const [complaints,setComplaints]=useState([]);
  const [loadingComplaint,setLoadingComplaint]=useState(false);

  const nav=useNavigate();

  useEffect(()=>{ loadAll(); },[]);

  useEffect(()=>{
    if(data?.id){
      api.post(`/system/check-attendance-alerts/${data.id}`)
      .then(()=>loadNotices())
      .catch(()=>{});
    }
  },[data]);

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

  const loadActs=()=> api.get("/student/activities").then(res=>setActs(res.data));
  const loadHistory=()=> api.get("/student/activity/history").then(res=>setHistory(res.data));
  const loadNotices=()=> api.get("/student/notices").then(res=>setNotices(res.data));
  const loadComplaints=()=> api.get("/student/complaints").then(res=>setComplaints(res.data));

  const doLogout=()=>{
    logout();
    nav("/");
  };

  const updateProfile=async()=>{
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

  const sendComplaint=async()=>{
    if(!complaintText.trim()) return alert("Write your complaint first");
    try{
      setLoadingComplaint(true);
      await api.post("/student/complaint",{message:complaintText});
      alert("Complaint sent ✅");
      setComplaintText("");
      loadComplaints();
    }catch{
      alert("Failed ❌");
    }
    setLoadingComplaint(false);
  };

  const resolveComplaint=async(id)=>{
    try{
      await api.put(`/student/complaint/${id}/resolve`);
      alert("Marked as Resolved ✅");
      loadComplaints();
    }catch{
      alert("Failed ❌");
    }
  };

  const downloadCSV=async()=>{
    try{
      const res=await api.get("/student/attendance/csv",{responseType:"blob"});
      const url=window.URL.createObjectURL(new Blob([res.data]));
      const link=document.createElement("a");
      link.href=url;
      link.download="attendance.csv";
      link.click();
    }catch{
      alert("Download failed");
    }
  };

  if(!data) return <h3>Loading...</h3>;

  const isSubmitted=id=>history.some(h=>h.activity_id===id);
  const totalDays=data.history.length;
  const presentDays=data.total;
  const percent=totalDays>0?Math.round((presentDays/totalDays)*100):0;

  return(

<div className="dashboard-layout">

  {/* SIDEBAR */}
  <div className="sidebar">
    <h2 className="logo">🎓 Student</h2>

    <ul>
      <li onClick={()=>setActiveTab("profile")} className={activeTab==="profile"?"active":""}>👤 Profile</li>
      <li onClick={()=>setActiveTab("activities")} className={activeTab==="activities"?"active":""}>📝 Activities</li>
      <li onClick={()=>setActiveTab("attendance")} className={activeTab==="attendance"?"active":""}>📊 Attendance</li>
      <li onClick={()=>setActiveTab("history")} className={activeTab==="history"?"active":""}>📜 History</li>
      <li onClick={()=>setActiveTab("complaints")} className={activeTab==="complaints"?"active":""}>📩 Complaints</li>
    </ul>

    <button className="logout-btn" onClick={doLogout}>Logout</button>
  </div>


  {/* MAIN CONTENT */}
  <div className="main-content">
    {/* MOBILE BOTTOM NAV */}
<div className="mobile-bottom-nav">
  <div 
    className={activeTab==="profile"?"nav-item active":"nav-item"}
    onClick={()=>setActiveTab("profile")}
  >
    <i className="fas fa-user"></i>
    <span>Profile</span>
  </div>

  <div 
    className={activeTab==="activities"?"nav-item active":"nav-item"}
    onClick={()=>setActiveTab("activities")}
  >
    <i className="fas fa-tasks"></i>
    <span>Activities</span>
  </div>

  <div 
    className={activeTab==="attendance"?"nav-item active":"nav-item"}
    onClick={()=>setActiveTab("attendance")}
  >
    <i className="fas fa-chart-line"></i>
    <span>Attendance</span>
  </div>

  <div 
    className={activeTab==="history"?"nav-item active":"nav-item"}
    onClick={()=>setActiveTab("history")}
  >
    <i className="fas fa-history"></i>
    <span>History</span>
  </div>

  <div 
    className={activeTab==="complaints"?"nav-item active":"nav-item"}
    onClick={()=>setActiveTab("complaints")}
  >
    <i className="fas fa-comment-dots"></i>
    <span>Complaints</span>
  </div>
</div>

    {/* HEADER */}
    <div className="top-bar">
      <h2>Student Dashboard</h2>

      <div className="notify-icon" onClick={()=>setShowNotice(true)}>
        🔔
        {notices.length>0 && <span className="notify-count">{notices.length}</span>}
      </div>
    </div>

    {/* NOTICE POPUP */}
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
          <button className="btn" onClick={()=>setShowNotice(false)}>Close</button>
        </div>
      </div>
    )}

    {/* PROFILE */}
    {activeTab==="profile" && (
      <div className="card">
        <h3>Profile</h3>
        <div className="profile-box">
          <div className="profile-left">
            {data.photo
              ? <img src={`http://127.0.0.1:5000/${data.photo}`} className="profile-img" alt="profile"/>
              : <div className="no-img">No Photo</div>}
            <input type="file" onChange={e=>setPhoto(e.target.files[0])}/>
          </div>

          <div className="profile-details">
            <p><b>Name:</b> {data.name}</p>
            <p><b>Roll:</b> {data.roll}</p>
            <p><b>Class:</b> {data.class}</p>
            <p><b>Section:</b> {data.section}</p>

            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)}/>

            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}/>

            <button className="btn" onClick={updateProfile} disabled={loading}>
              {loading?"Saving...":"Save Profile"}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ACTIVITIES */}
    {activeTab==="activities" && (
      <div className="card">
        <h3>Activities</h3>
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
                  <td>{submitted?hist.status:"PENDING"}</td>
                  <td>
                    {submitted
                      ? <span style={{color:"green"}}>Submitted</span>
                      : <>
                          <input type="file"
                            onChange={e=>setFiles({...files,[a.id]:e.target.files[0]})}/>
                          <button className="btn" onClick={()=>submit(a.id)}>Submit</button>
                        </>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}

    {/* ATTENDANCE */}
    {activeTab==="attendance" && (
      <div className="card">
        <h3>Attendance</h3>

        <div className="stats-box">
          <div className="stat"><h3>{totalDays}</h3><p>Total Days</p></div>
          <div className="stat"><h3>{presentDays}</h3><p>Present</p></div>
          <div className="stat"><h3>{percent}%</h3><p>Percentage</p></div>
        </div>

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
            {data.history.map((r,i)=>(
              <tr key={i}>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>{r.method}</td>
                <td style={{color:"green"}}>Present</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn" onClick={downloadCSV}>
          📥 Download Report
        </button>
      </div>
    )}

    {/* HISTORY */}
    {activeTab==="history" && (
      <div className="card">
        <h3>Activity History</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h,i)=>(
              <tr key={i}>
                <td>{h.title}</td>
                <td>{h.status}</td>
                <td>{h.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* COMPLAINTS */}
    {activeTab==="complaints" && (
      <div className="card">
        <h3>Raise Complaint</h3>

        <textarea rows="4"
          value={complaintText}
          onChange={e=>setComplaintText(e.target.value)}
          placeholder="Write your issue here..."
        />

        <button className="btn" onClick={sendComplaint} disabled={loadingComplaint}>
          {loadingComplaint?"Sending...":"Send Complaint"}
        </button>

        <hr/>

        <h3>Complaint History</h3>
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
                  {c.status!=="RESOLVED"
                    ? <button className="btn" onClick={()=>resolveComplaint(c.id)}>Mark as Resolved</button>
                    : <span style={{color:"green",fontWeight:"bold"}}>✅ Done</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

  </div>

</div>

  );
}