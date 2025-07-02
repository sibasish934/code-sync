import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Editor from "./components/Editor";
import "./App.css";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<Editor />} />
      </Routes>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "#4aed88",
              },
            },
          }}
        ></Toaster>
        <h1>Testing..</h1>
      </div>
    </>
  );
};

export default App;
