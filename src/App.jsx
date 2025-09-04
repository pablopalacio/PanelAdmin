import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Estudiantes from "./pages/Estudiantes";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/estudiantes"
          element={token ? <Estudiantes /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;