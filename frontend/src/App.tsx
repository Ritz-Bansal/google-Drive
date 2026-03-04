import "./index.css"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Landing from "./screens/Landing";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";

import Profile from "./screens/Profile";
import Home from "./screens/Home";
import { useEffect } from "react";
import globalRouter from "./lib/globalRouter";
import Protected from "./components/Protected";

export function App() {
  const navigate = useNavigate();
  globalRouter.navigate = navigate; 

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<Protected/>}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home/:parentId?" element={<Home/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App;
