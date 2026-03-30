import { useState } from "react";
import api from "../../services/api";

export default function SendNotice(){

  const [title,setTitle]=useState("");
  const [msg,setMsg]=useState("");

  const send=async()=>{

    if(!title||!msg) return alert("Fill all");

    await api.post("/teacher/notice",{
      title,
      message:msg
    });

    alert("Notice Sent");

    setTitle("");
    setMsg("");
  };

  return(

    <div className="card">

      <h2>📢 Send Notice</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />

      <textarea
        placeholder="Message"
        value={msg}
        onChange={e=>setMsg(e.target.value)}
      />

      <button className="btn" onClick={send}>
        Send
      </button>

    </div>
  );
}
