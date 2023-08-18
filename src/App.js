import React from "react";
import {Route, Routes, BrowserRouter as Router}  from 'react-router-dom'

import ForgetPassword from "./pages/ForgetPassword";
import LoginRegister from "./pages/LoginRegister"
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AdminPanel from "./pages/AdminPanel";
import SecretaryPanel from "./pages/SecretaryPanel";
import ProfilePage from "./pages/ProfilePage";
import BuildingPage from "./pages/BuildingPage";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const App = ()=> {
  return (
    <React.Fragment>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login-register" element={<LoginRegister/>}/>
        <Route path="/reset-password" element={<ForgetPassword/>}/>
        {/* <Route path="/super-admin-panel" element={<AdminPanel/>}/>
        <Route path="/secretary-panel" element={<SecretaryPanel/>}/> */}
        <Route path="/profile" element={<ProfilePage />}/>
        <Route path="/buildings/:id" element={<BuildingPage />}/>
      </Routes>
    </Router>
    <Footer/>
    </React.Fragment>
  );
}

export default App;
