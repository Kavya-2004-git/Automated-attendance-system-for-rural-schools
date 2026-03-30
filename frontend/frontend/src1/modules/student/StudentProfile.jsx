import { useState } from "react";
import api from "../../services/api";

export default function StudentProfile(){

  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [photo,setPhoto]=useState(null);

  const save = async()=>{

    const fd = new FormData();

    if(email) fd.append("email",email);
    if(pass) fd.append("password",pass);
    if(photo) fd.append("photo",photo);

    await api.post("/student/update",fd);

    alert("Updated");
  };

  return(

    <div>

      <h3>Profile</h3>

      <input
        placeholder="Email"
        onChange={e=>setEmail(e.target.value)}
      />

      <br/>

      <input
        type="password"
        placeholder="New Password"
        onChange={e=>setPass(e.target.value)}
      />

      <br/>

      <input
        type="file"
        onChange={e=>setPhoto(e.target.files[0])}
      />

      <br/><br/>

      <button onClick={save}>
        Save
      </button>

    </div>
  );
}
