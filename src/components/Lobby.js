import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles.css"; // Import CSS file


const Lobby = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    // Fetch available code blocks from the server
    fetch("http://localhost:5000/codeblocks")
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


// import React from 'react';
// import { Link } from 'react-router-dom';

// const codeBlocks = [
//   { id: '1', name: 'Async case' },
//   { id: '2', name: 'Closure case' },
//   { id: '3', name: 'Promises case' },
//   { id: '4', name: 'Scope case' }
// ];

// function Lobby() {
//   return (
//     <div>
//       <h1>Choose code block</h1>
//       <ul>
//         {codeBlocks.map((block) => (
//           <li key={block.id}>
//             <Link to={`/codeblock/${block.id}`}>{block.name}</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Lobby;
