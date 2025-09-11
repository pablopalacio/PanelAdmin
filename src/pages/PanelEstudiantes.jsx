import React from "react";
import { useApiLogin } from "../hooks/useApiLogin";
import Logout from "../components/logout";
import Perfil from "../components/perfil";
import CargarServicio from "../components/cargarServicio";

export default function PanelEstudiantes() {
  const { user, logout } = useApiLogin();

  return (
    <>
      <footer className="w-full relative">
        {" "}
        <img
          className="lg:h-[300px] h-[200px] w-full object-cover"
          src="/Diseño sin título (2).png"
          alt=""
        />
        <div className="absolute top-0 right-2">
          <Logout logout={logout} />
        </div>
        <div className="absolute lg:top-55 md:top-35 top-38 md:left-10 left-4 lg:w-48 lg:h-48 md:w-36 md:h-36 w-24 h-24 8xl:w-24 8xl:h-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
          <span className="lg:text-8xl md:text-6xl text-4xl">👤</span>
        </div>
      </footer>

      <main className="w-full">
        <section className="bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl  w-full flex flex-col justify-center items-center text-gray-800">
          <p className="pt-15 font-semibold text-xl md:text-2xl pb-4">
            Bienvenido{" "}
            <span className="font-light text-md">{user?.full_name}</span>{" "}
          </p>
        </section>
        <div className=" md:flex ">
          <section className="w-full px-2 py-6 grid gap-6 ">
            <Perfil user={user} />
          </section>

          <section className="w-full px-2 py-6">
            <CargarServicio />
          </section>
        </div>
      </main>
    </>
  );
}
