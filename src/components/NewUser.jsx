import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";

export default function NewUser({ onSave, toggleModal, setToggleModal }) {
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [flastname, setFlastname] = useState("");
  const [slastname, setSlastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schools, setSchools] = useState([]);
  const [controller, setController] = useState("");
  const [recruiter, setRecruiter] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableData, setAvailableData] = useState({
    recruiters: [],
    controllers: [],
    countries: [],
    schools: [],
    roles: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener todos los datos necesarios
        const [countriesRes, schoolsRes, usersRes] = await Promise.all([
          axiosInstance.get("/countries"),
          axiosInstance.get("/schools"),
          axiosInstance.get("/users"),
        ]);

        // Extraer roles únicos de los usuarios
        const rolesMap = new Map();
        usersRes.data.forEach((user) => {
          if (user.role) {
            rolesMap.set(user.role.id, user.role);
          }
        });
        const uniqueRoles = Array.from(rolesMap.values());

        // Filtrar usuarios por rol
        const recruiters = usersRes.data.filter((user) => user.role_id === 3);
        const controllers = usersRes.data.filter((user) => user.role_id === 2);

        setAvailableData({
          recruiters,
          controllers,
          countries: countriesRes.data,
          schools: schoolsRes.data,
          roles: uniqueRoles,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Error al cargar datos del formulario: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    if (toggleModal) {
      fetchData();
    }
  }, [toggleModal]);

  const handleNewUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones básicas
    if (!role) {
      setError("Por favor selecciona un rol");
      setLoading(false);
      return;
    }

    // Validación: escuela requerida para todos excepto administradores
    if (role !== "1" && schools.length === 0) {
      setError("Por favor selecciona una escuela");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        f_name: fname,
        s_name: sname || null,
        f_lastname: flastname,
        s_lastname: slastname || null,
        email,
        password,
        role_id: parseInt(role),
        phone: null,
        country_id: country ? parseInt(country) : null,
        // Siempre enviar schools, pero vacío para administradores
        schools: role === "1" ? [] : schools.map((school) => parseInt(school)),
      };

      // Solo agregar estos campos específicos para estudiantes
      if (role === "4") {
        userData.controller_id = controller ? parseInt(controller) : null;
        userData.recruiter_id = recruiter ? parseInt(recruiter) : null;
      }

      await axiosInstance.post("/users/", userData);

      // Limpieza de formulario
      setFname("");
      setSname("");
      setFlastname("");
      setSlastname("");
      setEmail("");
      setPassword("");
      setSchools([]);
      setController("");
      setRecruiter("");
      setCountry("");
      setRole("");

      alert("✅ Usuario creado correctamente");
      onSave();
      setToggleModal(false);
    } catch (err) {
      console.error("Error creando usuario:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Error desconocido";
      setError("❌ Error al crear usuario: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    // Limpiar campos específicos de estudiantes cuando no es estudiante
    if (selectedRole !== "4") {
      setRecruiter("");
      setController("");
    }

    // Limpiar escuela si es admin (rol 1) ya que no se necesita
    if (selectedRole === "1") {
      setSchools([]);
    }
  };

  return (
    <div
      className={`fixed inset-0 items-center justify-center bg-black/45 z-50 ${
        toggleModal ? "flex" : "hidden"
      }`}
    >
      <form
        onSubmit={handleNewUser}
        className="max-w-lg mx-auto bg-white p-5 w-[90%] rounded-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Nuevo Usuario</h2>
          <button
            type="button"
            onClick={() => setToggleModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {loading && !availableData.countries.length ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Cargando datos...</p>
          </div>
        ) : (
          <>
            {/* Rol */}
            <div className="relative z-0 w-full mb-5 group">
              <select
                onChange={handleRoleChange}
                value={role}
                className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                required
                disabled={loading}
              >
                <option value="">Seleccionar Rol *</option>
                {availableData.roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Rol
              </label>
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  onChange={(e) => setFname(e.target.value)}
                  value={fname}
                  type="text"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  disabled={loading}
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Primer Nombre *
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  onChange={(e) => setSname(e.target.value)}
                  value={sname}
                  type="text"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  disabled={loading}
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Segundo Nombre
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  onChange={(e) => setFlastname(e.target.value)}
                  value={flastname}
                  type="text"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  disabled={loading}
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Primer Apellido *
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  onChange={(e) => setSlastname(e.target.value)}
                  value={slastname}
                  type="text"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  disabled={loading}
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Segundo Apellido
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  disabled={loading}
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Email *
                </label>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  disabled={loading}
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Password *
                </label>
              </div>
            </div>

            {/* Escuela - no requerida para administradores (rol 1) */}
            {role !== "1" && (
              <div className="relative z-0 w-full mb-5 group">
                <select
                  onChange={(e) => setSchools([e.target.value])}
                  value={schools[0] || ""}
                  className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required={role !== "1"} // Requerido para todos excepto administradores
                  disabled={loading}
                >
                  <option value="">Seleccionar Escuela *</option>
                  {availableData.schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Escuela *
                </label>
              </div>
            )}

            {/* Campos específicos solo para estudiantes */}
            {role === "4" && (
              <>
                <div className="relative z-0 w-full mb-5 group">
                  <select
                    onChange={(e) => setRecruiter(e.target.value)}
                    value={recruiter}
                    className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    disabled={loading}
                  >
                    <option value="">Seleccionar Reclutador (opcional)</option>
                    {availableData.recruiters.map((rec) => (
                      <option key={rec.id} value={rec.id}>
                        {rec.full_name}
                      </option>
                    ))}
                  </select>
                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Reclutador
                  </label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                  <select
                    onChange={(e) => setController(e.target.value)}
                    value={controller}
                    className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    disabled={loading}
                  >
                    <option value="">Seleccionar Controller (opcional)</option>
                    {availableData.controllers.map((cont) => (
                      <option key={cont.id} value={cont.id}>
                        {cont.full_name}
                      </option>
                    ))}
                  </select>
                  <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Controller
                  </label>
                </div>
              </>
            )}

            <div className="relative z-0 w-full mb-5 group">
              <select
                onChange={(e) => setCountry(e.target.value)}
                value={country}
                className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                disabled={loading}
              >
                <option value="">Seleccionar País (opcional)</option>
                {availableData.countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                País
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creando usuario..." : "Crear Usuario"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
