import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {oneDark} from "@codemirror/theme-one-dark";
import "../styles.css"; 
import home from '../images/home.png';
import readOnly from '../images/readOnly.png';

// localy - "http://localhost:5000"
// const socket = io("http://localhost:5000");
const socket = io("https://coding-app-4.onrender.com");


const CodeBlockPage = () => {
  const { id } = useParams(); // Get codeblockId from URL
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState(0);
  const [role, setRole] = useState("student");
  const [code, setCode] = useState("");
  const [showSmiley, setShowSmiley] = useState(false);
  const [hint, setHint] = useState(""); // Store hints
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    socket.emit("join_codeblock", id);

    socket.on("update_user_data", ({ mentor, studentCount }) => {
      setStudentCount(studentCount);
      if (mentor === socket.id) setRole("mentor");
    });

    socket.on("load_code_and_hint", ({content, hint}) => {
      setCode(content);
      setHint(hint);
    });

    socket.on("code_update", (newCode) => {
      if (role === "student") setCode(newCode);
    });

    socket.on("solution_matched", () => {
      setShowSmiley(true); // Show the smiley face when the solution matches
    })

    socket.on("mentor_left", () => {
      alert("The mentor has left. Redirecting to the lobby...");
      navigate("/"); // Redirect to lobby
    });


    return () => {
      socket.emit("leave_codeblock", id);
    };

  }, [id]);

  const handleCodeChange = (value) => {
    if (role === "student") {
      setCode(value);
      socket.emit("code_update", { codeblockId: id, newCode: value });
    }
  };

  const redirectToLobby = () => {
    navigate("/");
  };

  return (
    <div className="container">
     <img src={home} style={{ width: '40px', height: '40px' }} onClick={redirectToLobby} alt="home"/> 
      <h1>Code Block {id}</h1>
      <p className="info">Your role: {role}</p>
      <p className="info">Number of students in the room: {studentCount}</p>
      <button className="button-hint" onClick={() => setShowHint(!showHint)}>Show Hint</button>
      {showHint && <p>💡 Hint: {hint}</p>}
      {showSmiley && <h1 style={{ fontSize: "100px" }}>😊</h1>}
      {role === "mentor" && (<img src={readOnly} style={{ width: '25px', height: '25px' }} alt="readOnly"/>)}
      <div className="code-editor">
      <CodeMirror
      value={code}
      extensions={[javascript()]} 
      theme={oneDark} 
      onChange={(code) => handleCodeChange(code)} 
      editable={role === "student"}   
    />
      </div>
    </div>
  );
};

export default CodeBlockPage;