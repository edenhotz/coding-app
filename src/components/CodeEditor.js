import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {oneDark} from "@codemirror/theme-one-dark";


function CodeEditor({ code, setCode, role }) {
  return (
    <CodeMirror
      value={code}
      extensions={[javascript()]} // This sets JavaScript as the syntax language
      theme={oneDark} // This applies the oneDark theme
      onChange={(value) => setCode(value)} // This updates the code in the parent component
      editable={role === "student"}   
    />
  );
}

export default CodeEditor;

// first
// import React, { useEffect, useState } from "react";
// import { EditorView, basicSetup } from "@codemirror/basic-setup";
// import { EditorState } from "@codemirror/state";
// import { javascript } from "@codemirror/lang-javascript";

// const CodeEditor = ({ code, handleCodeChange, role }) => {
//   const [editor, setEditor] = useState(null);

//   useEffect(() => {
//     const parent = document.getElementById("editor-container");
    
//     if (parent && !editor) {
//       const startState = EditorState.create({
//         doc: code,
//         extensions: [
//           basicSetup,
//           javascript(),
//           EditorView.updateListener.of((update) => {
//             if (update.docChanged) {
//               handleCodeChange(update.state.doc.toString());
//             }
//           }),
//           role === "student" ? EditorView.editable.of(false) : [],
//         ],
//       });

//       const view = new EditorView({
//         state: startState,
//         parent,
//       });

//       setEditor(view);
//     }

//     return () => editor?.destroy();
//   }, [code, handleCodeChange, role, editor]);

//   return <div id="editor-container" style={{ border: "1px solid #ddd" }} />;
// };

// export default CodeEditor;


// first
// import React, { useEffect, useRef } from 'react';
// import { Controlled as CodeMirror } from 'react-codemirror'; // Assuming you are using react-codemirror2

// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/material.css";
// import "codemirror/mode/javascript/javascript";

// const CodeEditor = ({ code, handleCodeChange, role }) => {
//   const editorRef = useRef();

//   useEffect(() => {
//     // Get the wrapper element of CodeMirror after it is rendered
//     const wrapper = editorRef.current?.editor?.getWrapperElement();

//     // Add passive event listeners to touchstart and touchmove if the wrapper exists
//     if (wrapper) {
//       wrapper.addEventListener('touchstart', (event) => {}, { passive: true });
//       wrapper.addEventListener('touchmove', (event) => {}, { passive: true });
//     }

//     // Cleanup event listeners when the component is unmounted or the editor is re-rendered
//     return () => {
//       if (wrapper) {
//         wrapper.removeEventListener('touchstart', () => {});
//         wrapper.removeEventListener('touchmove', () => {});
//       }
//     };
//   }, []);

//   return (
//     <CodeMirror
//       value={code}
//       options={{
//         mode: "javascript",
//         theme: "material",
//         lineNumbers: true,
//       }}
//       onBeforeChange={handleCodeChange}
//       readOnly={role === "student"}
//       editorDidMount={(editor) => {
//         // This gives you the CodeMirror instance
//         editorRef.current = { editor };
//       }}
//     />
//   );
// };

// export default CodeEditor;
