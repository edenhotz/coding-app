import React, { useEffect, useRef } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2'; // Assuming you are using react-codemirror2

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";

const CodeEditor = ({ code, handleCodeChange, role }) => {
  const editorRef = useRef();

  useEffect(() => {
    // Get the wrapper element of CodeMirror after it is rendered
    const wrapper = editorRef.current?.editor?.getWrapperElement();

    // Add passive event listeners to touchstart and touchmove if the wrapper exists
    if (wrapper) {
      wrapper.addEventListener('touchstart', (event) => {}, { passive: true });
      wrapper.addEventListener('touchmove', (event) => {}, { passive: true });
    }

    // Cleanup event listeners when the component is unmounted or the editor is re-rendered
    return () => {
      if (wrapper) {
        wrapper.removeEventListener('touchstart', () => {});
        wrapper.removeEventListener('touchmove', () => {});
      }
    };
  }, []);

  return (
    <CodeMirror
      value={code}
      options={{
        mode: "javascript",
        theme: "material",
        lineNumbers: true,
      }}
      onBeforeChange={handleCodeChange}
      readOnly={role === "student"}
      editorDidMount={(editor) => {
        // This gives you the CodeMirror instance
        editorRef.current = { editor };
      }}
    />
  );
};

export default CodeEditor;
