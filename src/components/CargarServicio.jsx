import React, { useEffect } from "react";

export default function CargarServicio({ user }) {
  //   console.log(user);
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       // Cargar servicios
  //       const servicesResponse = await axiosInstance.get("/services");
  //       setService(servicesResponse.data);
  //     } catch (err) {
  //       console.error("Error fetching data:", err);
  //       setError(err.response?.data?.message || err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   useEffect(() => {
  //     fetchData();
  //   }, []);

  return (
    <>
      {" "}
      <div className="w-full bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl px-4 rounded-2xl ">
        <h3 className="font-semibold text-xl text-center p-4">
          Horas de Servicio
        </h3>
        <h4 className="font-semibold">Tipo de Servicio</h4>
        <div className="flex flex-wrap gap-2 p-4">
          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md">
            Indexar
          </button>
          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md">
            Servicio
          </button>{" "}
          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md">
            Templo
          </button>{" "}
          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md">
            Liderazgo
          </button>{" "}
          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md">
            Instructor
          </button>
          <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md">
            Brujula
          </button>
        </div>
        <div className="py-4">
          <div>
            <h4 className="font-semibold">Cantidad de Horas</h4>
            <div className="flex gap-4 items-center">
              <button className="bg-red-600 text-white rounded-full px-3 py-1">
                -
              </button>
              <span className="text-xl">0</span>
              <button className="bg-blue-600 text-white rounded-full px-3 py-1">
                +
              </button>
            </div>
            <div className="py-4">
              <h4>Descripción</h4>

              <form className="max-w-sm mx-auto">
                <textarea
                  id="message"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Escribe aqui algun comentario..."
                ></textarea>
              </form>
            </div>
          </div>
          <div>
            <h4 className="font-bold">Cargar Evidencias</h4>

            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            </div>
          </div>
          <div>
            <button className="px-2 py-1 bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md">
              Cancelar
            </button>
            <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg font-semibold transition duration-200 shadow-md">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
