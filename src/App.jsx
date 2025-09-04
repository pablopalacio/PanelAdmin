
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Estudiantes from "./pages/Estudiantes";

import Aside from "./components/Aside";
import Tablas from "./components/tablas";



function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/estudiantes"
          element={token ? <Estudiantes /> : <Navigate to="/login" />}
          <Aside />
          <Tablas />
        />
      </Routes>
    </Router>
  );
}

export default App;
