import React from "react";

export default function EditarHorasServicio({ open, setOpen }) {
  return (
    <div
      className={`fixed inset-0 items-center justify-center bg-black/45 z-50 ${
        open ? "flex" : "hidden"
      }`}
    >
      <form
        // onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-5 w-[90%] rounded-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Editar Perfil</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
            // disabled={loading}
          >
            ×
          </button>
        </div>
        {/* 
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
            <p className="text-green-700 text-sm">
              ✅ Perfil actualizado correctamente. Recargando...
            </p>
          </div>
        )} */}

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="f_name"
              //   value={formData.f_name}
              //   onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              //   disabled={loading}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Primer Nombre *
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="s_name"
              //   value={formData.s_name}
              //   onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              //   disabled={loading}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Segundo Nombre
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="f_lastname"
              //   value={formData.f_lastname}
              //   onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              //   disabled={loading}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Primer Apellido *
            </label>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="s_lastname"
              //   value={formData.s_lastname}
              //   onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              //   disabled={loading}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Segundo Apellido
            </label>
          </div>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            // value={user?.email || ""}
            disabled
            className="block py-2.5 px-0 w-full text-sm text-gray-600 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer cursor-not-allowed"
            placeholder=" "
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Email (no editable)
          </label>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            type="submit"
            // disabled={loading}
            className="w-37 bg-blue-600  text-white cursor-pointer py-2.5 text-sm rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mx-auto inline-block mr-2"></div>
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )} */}
          </button>
        </div>
      </form>
    </div>
  );
}
