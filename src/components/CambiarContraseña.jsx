import React, { useState } from "react";
import axios from "../config/axiosConfig";
import { useApiLogin } from "../hooks/useApiLogin";
import { useNavigate } from "react-router-dom";

const CambiarContraseña = ({ open, onClose }) => {
  const { logout } = useApiLogin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

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

    // Validar que todos los campos estén llenos
    if (
      !formData.old_password ||
      !formData.new_password ||
      !formData.confirm_password
    ) {
      setError("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (formData.old_password === formData.new_password) {
      setError("La nueva contraseña debe ser diferente a la actual");
      setLoading(false);
      return;
    }

    // Validar que las nuevas contraseñas coincidan
    if (formData.new_password !== formData.confirm_password) {
      setError("Las nuevas contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      // Enviar solo los campos requeridos por el endpoint
      const payload = {
        old_password: formData.old_password,
        new_password: formData.new_password,
      };

      await axios.put("/auth/change-password", payload);

      setSuccess(true);
      setFormData({ old_password: "", new_password: "", confirm_password: "" });

      // Cerrar sesión y redirigir a Login
      setTimeout(() => {
        logout();
        navigate("/Login");
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error changing password:", err);

      if (err.response?.status === 401) {
        setError("Contraseña actual incorrecta");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Error al cambiar la contraseña. Por favor, intente nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setFormData({ old_password: "", new_password: "", confirm_password: "" });
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
          <h2 className="text-xl font-bold text-gray-800">
            Cambiar Contraseña
          </h2>
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
              ✅ Contraseña cambiada correctamente. Vuelva a iniciar sesión...
            </p>
          </div>
        )}

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleInputChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            disabled={loading}
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Contraseña Actual *
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleInputChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            disabled={loading}
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Nueva Contraseña *
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            disabled={loading}
          />
          <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Confirmar Nueva Contraseña *
          </label>
        </div>
        <div className="w-full flex justify-center items-center">
          <button
            type="submit"
            disabled={loading}
            className="w-37 text-sm cursor-pointer bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mx-auto inline-block mr-2"></div>
                Cambiando...
              </>
            ) : (
              "Cambiar Contraseña"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CambiarContraseña;
