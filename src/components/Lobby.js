import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css";


const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    // Fetch available code blocks from the server
    // localy - "http://localhost:5000/codeblocks"
     fetch("https://coding-app-4.onrender.com/codeblocks")
      .then((res) => res.json())
      .then((data) => setCodeBlocks(data));
  }, []);

  return (
    <div className="lobby-container">
      <h1>Lobby</h1>
      <div className="lobby-links">
      {codeBlocks.map((block) => (
        <div key={block.id}>
          <Link to={`/codeblock/${block.id}`}>{block.title}</Link>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Lobby;