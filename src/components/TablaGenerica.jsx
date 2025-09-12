import { useMemo, useState, useEffect } from "react";

export default function TablaGenerica({
  data,
  columns,
  editFields,
  onSave,
  searchTerm,
  actions = [],
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState(data || []);

  useEffect(() => {
    setLocalData(data || []);
  }, [data]);

  const handleEditClick = (item) => {
    setEditingId(item.id);
    const initialValues = editFields.reduce((acc, field) => {
      acc[field.name] = item[field.name] || "";
      return acc;
    }, {});
    setEditValues(initialValues);
  };

  const handleCancel = () => setEditingId(null);
  const handleInputChange = (e) => {
    setEditValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (id) => {
    setLoading(true);
    try {
      const updatedItem = await onSave(id, editValues);
      setLocalData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar:", error.response || error);
      alert("No se pudo actualizar el registro.");
    } finally {
      setLoading(false);
    }
  };

  const searchKey = columns.find((c) => !c.isAction)?.accessor || "id";
  const filteredData = useMemo(() => {
    if (!localData) return [];
    return localData.filter((e) =>
      searchTerm
        ? String(e[searchKey] || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true
    );
  }, [localData, searchTerm, searchKey]);

  const renderCell = (item, column) => {
    if (column.render) return column.render(item);
    // Accesor anidado (ej. 'user.name') - se separa por '.' y se busca en el objeto
    const value = column.accessor.split(".").reduce((p, c) => p && p[c], item);
    return value === null || typeof value === "undefined" ? "N/A" : value;
  };

  const defaultEditAction = {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
        />
      </svg>
    ),
    handler: (item) => handleEditClick(item),
    title: "Editar",
    className:
      "text-[#8d8e91] hover:text-blue-400 cursor-pointer hover:scale-105 transition-colors duration-200",
  };

  if (!data) return <div className="text-center p-4">Cargando...</div>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-center text-gray-100 uppercase bg-blue-600">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredData.map((item) => (
            <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
              {columns.map((col) => {
                const isEditing = editingId === item.id;
                const fieldConfig = editFields.find(
                  (f) => f.name === col.accessor
                );

                return (
                  <td
                    key={`${item.id}-${col.accessor}`}
                    className="px-4 py-4 text-start align-middle"
                  >
                    {/* --- MODO EDICIÓN PARA CELDAS DE DATOS --- */}
                    {isEditing && !col.isAction ? (
                      col.renderEdit ? (
                        col.renderEdit(editValues, handleInputChange)
                      ) : fieldConfig ? (
                        fieldConfig.type === "select" ? (
                          <select
                            name={col.accessor}
                            value={editValues[col.accessor] || ""}
                            onChange={handleInputChange}
                            className="border border-gray-400 px-2 py-1 rounded text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Seleccionar</option>
                            {fieldConfig.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={fieldConfig.type || "text"}
                            name={col.accessor}
                            value={editValues[col.accessor] || ""}
                            onChange={handleInputChange}
                            className="border px-2 py-1 rounded border-gray-400 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder={fieldConfig.placeholder}
                          />
                        )
                      ) : (
                        renderCell(item, col)
                      )
                    ) : col.isAction ? (
                      <div className="flex justify-center space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSave(item.id)}
                              disabled={loading}
                              className="text-green-500 hover:text-green-700"
                              title="Guardar"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-red-500 hover:text-red-700"
                              title="Cancelar"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18 18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            {actions.map((action) => (
                              <button
                                key={action.title}
                                onClick={() => action.handler(item)}
                                className={action.className}
                                title={action.title}
                              >
                                {action.icon}
                              </button>
                            ))}
                            <button
                              key={defaultEditAction.title}
                              onClick={() => defaultEditAction.handler(item)}
                              className={defaultEditAction.className}
                              title={defaultEditAction.title}
                            >
                              {defaultEditAction.icon}
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      renderCell(item, col)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
