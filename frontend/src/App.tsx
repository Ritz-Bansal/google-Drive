import "./index.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Signup from "./screens/Signup";
import Signin from "./screens/Signin";

import Profile from "./screens/Profile";
import Home from "./screens/Home";
import { useEffect } from "react";
import globalRouter from "./lib/globalRouter";
import Protected from "./components/Protected";
import SharedLink from "./screens/SharedLink";

export function App() {
  const navigate = useNavigate();
  globalRouter.navigate = navigate;

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/home/:hash/:resourceId" element={<SharedLink />} />
        <Route element={<Protected />}>
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/home/:parentId?" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
