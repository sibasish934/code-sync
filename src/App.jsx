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
      </div>
    </>
  );
};

export default App;
