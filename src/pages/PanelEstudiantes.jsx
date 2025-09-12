import React from "react";
import { useApiLogin } from "../hooks/useApiLogin";
import Logout from "../components/Logout";
import CargarServicio from "../components/CargarServicio";
import Perfil from "../components/Perfil";

export default function PanelEstudiantes() {
  const { user, logout } = useApiLogin();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="relative w-full overflow-hidden">
        <img
          className="lg:h-[300px] h-[200px] w-full object-cover"
          src="/Diseño sin título (2).png"
          alt="Header background"
        />
        <div className="absolute top-4 right-4">
          <Logout logout={logout} />
        </div>
      </header>

      <main className=" px-4 pb-10">
        <section className="bg-white flex items-center justify-center rounded-xl shadow-md mt-6 p-6 ">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Bienvenido{" "}
            <span className="font-normal text-blue-600">{user?.f_name}</span>
            <span className="font-normal text-blue-600">{user?.m_name}</span>
            <span className="font-normal text-blue-600">
              {user?.f_lastname}
            </span>
            <span className="font-normal text-blue-600">
              {user?.s_lastname}
            </span>
          </h1>
        </section>
        <div className="md:flex gap-6 mt-6">
          <section className="w-full md:w-2/5">
            <Perfil user={user} />
          </section>
          <section className="w-full md:w-3/5 mt-6 md:mt-0">
            <CargarServicio user={user} />
          </section>
        </div>
      </main>
      <div className="absolute hidden lg:top-48 md:top-32 top-28 md:left-10 left-4 lg:w-48 lg:h-48 md:w-36 md:h-36 w-24 h-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full md:flex items-center justify-center border-4 border-white shadow-xl">
        <span className="lg:text-8xl md:text-6xl text-4xl">👤</span>
      </div>
    </div>
  );
}
