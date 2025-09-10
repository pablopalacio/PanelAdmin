import React, { useState, useEffect } from "react";
import { useApiNewUser } from "../hooks/useApiPost";

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
  const [message, setMessage] = useState("");
  const { createUser, data, loading, error } = useApiNewUser();

  const handleNewUser = async () => {
    try {
      const nuevoUsuario = {
        f_name: fname,
        s_name: sname,
        f_lastname: flastname,
        s_lastname: slastname,
        email,
        password,
        role_id: 4,
        schools: schools, // array aunque sea 1 solo
        controller_id: controller,
        recruiter_id: recruiter,
        country_id: country,
      };

      const res = await createUser(
        "https://www.hs-service.api.crealape.com/api/v1/users/",
        nuevoUsuario
      );
      setMessage("✅ Usuario creado correctamente");
      onSave();
      alert("✅ Usuario creado correctamente");

      // Limpieza de formulario
      setFname("");
      setSname("");
      setFlastname("");
      setSlastname("");
      setEmail("");
      setPassword("");
      setSchools([]);
      setController(0);
      setRecruiter(0);
      setCountry(0);
      setToggleModal(false);
    } catch (err) {
      alert("Error creando usuario:", message);
      setMessage(
        "❌ Error al crear usuario: " +
          (err.response?.data?.message || err.message)
      );
    }
  };
  return (
    <div
      className={`fixed inset-0  items-center justify-center bg-black/45 z-50
        ${toggleModal ? "flex" : "hidden"}
        `}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNewUser();
        }}
        className="max-w-lg mx-auto bg-white p-5 w-[80%] rounded-2xl"
      >
        <div
          onClick={() => setToggleModal(false)}
          className="w-full flex justify-end"
        >
          <svg
            className="w-5 h-5 hover:text-blue-700  cursor-pointer  text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              onChange={(e) => setFname(e.target.value)}
              value={fname}
              type="text"
              name="floating_first_name"
              id="floating_first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_first_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Primer Nombre
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              onChange={(e) => setSname(e.target.value)}
              value={sname}
              type="text"
              name="floating_second_name"
              id="floating_secondt_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_last_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
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
              name="floating_first_lastname"
              id="floating_first_lastname"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_first_lastname"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Primer Apellido
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              onChange={(e) => setSlastname(e.target.value)}
              value={slastname}
              type="text"
              name="floating_second_lastname"
              id="floating_second_lastname"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_last_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Segundo Apelldo
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              name="floating_email"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              name="floating_password"
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <select className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer">
              <option>Rol</option>
              <option value="4">Estudiante</option>
            </select>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              onChange={(e) => setSchools([Number(e.target.value)])}
              value={schools[0] || ""}
              className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option>Escuela</option>
              <option value="1">Programacion</option>
              <option value="2">Ingles</option>
              <option value="3">Matematicas</option>
              <option value="4">Redes</option>
              <option value="5">Marketing Digital</option>
              <option value="8">FullStack</option>
              <option value="16">Python</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <select
              onChange={(e) => setRecruiter(Number(e.target.value))}
              value={recruiter ?? ""}
              className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option>Reclutador</option>
              <option value="27">Gonzalo Perez</option>
              <option value="36">Luffy D. Monkey</option>
            </select>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              onChange={(e) => setController(Number(e.target.value))}
              value={controller ?? ""}
              className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option>Controller</option>
              <option value="2">Jorge Sosa Nuñez</option>
              <option value="5">Jorge Sosa Nuñez</option>
              <option value="24">Diego Maradona</option>
              <option value="28">El Jefaso dos uno</option>
            </select>
          </div>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <select
            onChange={(e) => setCountry(Number(e.target.value))}
            value={country ?? ""}
            className="block cursor-pointer py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          >
            <option>Pais</option>
            <option value="1">Russian Federation</option>
            <option value="2">Cameroon</option>
            <option value="3">Chile</option>
            <option value="4">Guatemala</option>
            <option value="5">Sweden</option>
          </select>
        </div>

        <button
          type="submit"
          className="text-white cursor-pointer bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
