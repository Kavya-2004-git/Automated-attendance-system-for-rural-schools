import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StudentList(){

  const [list,setList] = useState([]);
  const [search,setSearch] = useState("");
  const [loading,setLoading] = useState(false);



  // ================= LOAD =================
  useEffect(()=>{
    load();
  },[]);


  const load = ()=>{

    api.get("/teacher/students")
      .then(res=>{
        setList(res.data);
      })
      .catch(()=>{
        alert("Failed to load students");
      });

  };



  // ================= DELETE =================
  const del = async(id)=>{

    if(!window.confirm("Delete this student?")) return;

    try{

      setLoading(true);

      await api.delete(`/teacher/delete-student/${id}`);

      alert("Deleted ✅");

      load();

    }catch{

      alert("Delete failed ❌");

    }

    setLoading(false);

  };



  // ================= FILTER =================
  const filtered = list.filter(s =>

    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())

  );



  return(

    <div className="card">

      <h2>📋 Students List</h2>



      {/* SEARCH */}
      <input
        placeholder="🔍 Search by Name / Roll / Class"
        value={search}
        onChange={e=>setSearch(e.target.value)}
        style={{
          marginBottom:"15px",
          padding:"8px",
          width:"100%"
        }}
      />



      {/* TABLE */}
      <table width="100%">

        <thead>
          <tr>
            <th>Name</th>
            <th>Roll</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filtered.length === 0 && (

            <tr>
              <td colSpan="4" align="center">
                No students found ❌
              </td>
            </tr>

          )}



          {filtered.map(s=>(

            <tr key={s.id}>

              <td>{s.name}</td>
              <td>{s.roll}</td>
              <td>{s.class}</td>

              <td>

                <button
                  className="danger-btn"
                  onClick={()=>del(s.id)}
                  disabled={loading}
                >
                  ❌ Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}
