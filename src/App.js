import { ToastContainer } from "react-toastify";
import "./App.css";
import Routing from "./AllRouting/Routing";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Login_Page from "./Components/Login_Page.jsx/Login_Page";
import MainLayout from "./Components/Main_layout";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem("authToken"));
    setToken(storedToken);
    document.title = "Dynamic Softlink Whatsapp Panal"; // Set the document title here
  }, [token]);

  return (
    <>
      <ToastContainer />
    
      {token ? <MainLayout /> : <Login_Page />}
    </>
  );
}

export default App;
