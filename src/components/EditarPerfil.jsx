import React, { useState, useEffect } from "react";
import axios from "../config/axiosConfig";
import { useApiLogin } from "../hooks/useApiLogin";

const EditarPerfil = ({ open, onClose, user }) => {
  const { logout } = useApiLogin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    f_name: "",
    s_name: "",
    f_lastname: "",
    s_lastname: "",
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        f_name: user.f_name || "",
        s_name: user.m_name || "", // m_name en user -> s_name en API
        f_lastname: user.f_lastname || "",
        s_lastname: user.s_lastname || "",
      });
    }
  }, [user, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.put(`/users/${user.id}`, formData);

      if (response.data) {
        setSuccess(true);

        // Actualizar la cookie del usuario con los nuevos datos
        const updatedUser = {
          ...user,
          f_name: formData.f_name,
          m_name: formData.s_name,
          f_lastname: formData.f_lastname,
          s_lastname: formData.s_lastname,
        };

        document.cookie = `user=${JSON.stringify(
          updatedUser
        )}; path=/; max-age=3600`;

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating profile:", err);

      if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicie sesión nuevamente.");
        setTimeout(() => {
          logout();
        }, 2000);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Error al actualizar el perfil. Por favor, intente nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 items-center justify-center bg-black/45 z-50 ${
        open ? "flex" : "hidden"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-5 w-[90%] rounded-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Editar Perfil</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
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

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
            <p className="text-green-700 text-sm">
              ✅ Perfil actualizado correctamente. Recargando...
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="f_name"
              value={formData.f_name}
              onChange={handleInputChange}
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
              type="text"
              name="s_name"
              value={formData.s_name}
              onChange={handleInputChange}
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
              type="text"
              name="f_lastname"
              value={formData.f_lastname}
              onChange={handleInputChange}
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
              type="text"
              name="s_lastname"
              value={formData.s_lastname}
              onChange={handleInputChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              disabled={loading}
            />
            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Segundo Apellido
            </label>
          </div>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            value={user?.email || ""}
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
            disabled={loading}
            className="w-37 bg-blue-600  text-white cursor-pointer py-2.5 text-sm rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mx-auto inline-block mr-2"></div>
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarPerfil;
