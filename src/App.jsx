// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Estudiantes from "./pages/Estudiantes";
import Controllers from "./pages/Controllers";
import Reclutadores from "./pages/Reclutador";
import HoraServicio from "./pages/HoraServicio";
import Escuela from "./pages/Escuela";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/estudiantes"
            element={
              <PrivateRoute>
                <Estudiantes />
              </PrivateRoute>
            }
          />
          <Route
            path="/controllers"
            element={
              <PrivateRoute>
                <Controllers />
              </PrivateRoute>
            }
          />
          <Route
            path="/reclutadores"
            element={
              <PrivateRoute>
                <Reclutadores />
              </PrivateRoute>
            }
          />
          <Route
            path="/horas-servicio"
            element={
              <PrivateRoute>
                <HoraServicio />
              </PrivateRoute>
            }
          />
          <Route
            path="/escuela"
            element={
              <PrivateRoute>
                <Escuela />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
