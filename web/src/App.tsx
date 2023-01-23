

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./lib/dayjs";
import "./styles/main.css";
import Home from "./views/Home";
import Login from "./views/Login";

function App() {
  return (
    <BrowserRouter >
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
          <Routes >
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
