import React from "react";
import { useNavigate } from "react-router";

export default function Logout({ logout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <button
      onClick={handleLogout}
      className=" w-40 2xl:w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-2 2xl:py-3 rounded-xl text-xs 2xl:text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center mt-9"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      CERRAR SESIÓN
    </button>
  );
}
