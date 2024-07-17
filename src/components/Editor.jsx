import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/SIBASISH.png";
import Client from "../pages/Client";
import EditorPage from "../pages/EditorPage";
import { initSocket } from "../socket";
import ACTIONS from "../../Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Editor = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(err) {
        console.log("socket error", err);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED , ({clients, username, socketId})=>{
        if(username !== location.state?.username){
          toast.success(`${username} joined the room`);
          console.log(`${username} joined`);
        }
        setClientList(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId
        })
      })

      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username})=>{
        toast.success(`${username} left the room!!`);
        setClientList((prev)=>{
          return prev.filter((elem) => elem.socketId !== socketId);
        })
      })
    };
    init();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        socketRef.current.off(ACTIONS.JOINED)
        socketRef.current.off(ACTIONS.DISCONNECTED)
      }
    };
  }, []);

  const [clientsList, setClientList] = useState([]);

  if (!location.state){
    return <Navigate to='/' />
  }

  const copyRoomId = async() => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id is copied to your clipboard");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src={logo} alt="logo" />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {clientsList.map((elem, index) => [
              <Client key={index} username={elem.username} />,
            ])}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <EditorPage socketRef={socketRef} roomId={roomId} onCodeChange={
          (code)=> {codeRef.current = code}
        } />
      </div>
    </div>
  );
};

export default Editor;
