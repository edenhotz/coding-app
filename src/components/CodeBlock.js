import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Controlled as CodeMirror } from "react-codemirror2";
import { useParams, useNavigate } from "react-router-dom";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "../styles.css"; // Import CSS file 
import home from '../images/home.png';
import readOnly from '../images/readOnly.png';
import CodeEditor from "./CodeEditor";

// localy - "http://localhost:5000"
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

  const handleCodeChange = (editor, data, value) => {
    if (role === "student") {
      setCode(value);
      socket.emit("code_update", { codeblockId: id, newCode: value });
    }
  };

  const redirectToLobby = () => {
    navigate("/");  // Redirect to the lobby page
  };

  return (
    <div className="container">
     <img src={home} style={{ width: '40px', height: '40px' }} onClick={redirectToLobby} alt="home"/> 
      <h1>Code Block {id}</h1>
      <p className="info">Your role: {role}</p>
      <p className="info">Number of students in the room: {studentCount}</p>
      <button class="button-hint" onClick={() => setShowHint(!showHint)}>Show Hint</button>
      {showHint && <p>💡 Hint: {hint}</p>}
      {showSmiley && <h1 style={{ fontSize: "100px" }}>😊</h1>}
      {role === "mentor" && (<img src={readOnly} style={{ width: '25px', height: '25px' }} alt="readOnly"/>)}
      <div className="code-editor">
      <CodeEditor
          code={code}
          handleCodeChange={handleCodeChange}
          role={role}
        />
      {/* <CodeMirror
        value={code}
        options={{
          mode: "javascript",
          theme: "material",
          lineNumbers: true,
        }}
        onBeforeChange={handleCodeChange}
        readOnly={role === "student"}
      /> */}
      </div>
    </div>
  );
};

export default CodeBlockPage;


// first
// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import { Controlled as CodeMirror } from 'react-codemirror2';
// import 'codemirror/lib/codemirror.css'; // Core styles
// import 'codemirror/theme/material.css'; // Theme styles
// import 'codemirror/mode/javascript/javascript';

//   // Connect to the WebSocket server
//   const socket = io('http://localhost:5000'); // Your WebSocket server URL

// const CodeBlockPage = () => {
//   const [studentCount, setStudentCount] = useState(0);
//   const [role, setRole] = useState('student'); // Assume default role is 'student'
//   const [code, setCode] = useState('');
//   const [solution, setSolution] = useState(''); // Set the solution for each code block

//   useEffect(() => {

//     // Listen for the student count update
//     socket.on('update_user_data', ({mentor, studentCount}) => {
//       setStudentCount(studentCount); // Update the state with the new student count
//     });

//     socket.on('code_update', (newCode) => {
//       if (role === 'student') {
//           setCode(newCode);
//       }
//   });

//   }, []);

//   const handleCodeChange = (editor, data, value) => {
//     if (role === 'student') {
//         setCode(value);
//         //socket.emit('codeChange', id, value); // Send the code change with the code block ID
//     }
// };

//   return (
//     <div>
//       <h1>Code Block</h1>
//       <p>Your role: {role}</p>
//       <p>Number of students in the room: {studentCount}</p>
//       <CodeMirror
//                 value={code}
//                 options={{
//                     mode: 'javascript',
//                     theme: 'material',
//                     lineNumbers: true,
//                 }}
//                 onBeforeChange={handleCodeChange}
//                 readOnly={role === 'mentor'}
//             />
//     </div>
//   );
// };

// export default CodeBlockPage;