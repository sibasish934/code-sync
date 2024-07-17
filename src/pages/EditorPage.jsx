import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../../Actions";

const EditorPage = ({ socketRef, roomId, onCodeChange }) => {
  const editor = useRef(null);
  useEffect(() => {
    async function init() {
      editor.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editor.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code)
        if (origin != "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            code,
            roomId,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editor.current.setValue(code);
        }
      });

    }

    return ()=>{
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  }, [socketRef.current]);
  return <textarea id="realtimeEditor"></textarea>;
};

export default EditorPage;
