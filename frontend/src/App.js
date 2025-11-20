import React, { useState } from "react";
import LoginPage from "./LoginPage";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return token
    ? <AdminDashboard token={token} />
    : <LoginPage setToken={setToken} />;
}

export default App;
