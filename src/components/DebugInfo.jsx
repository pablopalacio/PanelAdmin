// Componente de depuración TEMPORAL - AGREGAR ESTO
const DebugInfo = () => {
  // Contar servicios con country_id
  const serviciosConCountryId = servicios.filter(
    (s) =>
      s.user && s.user.country_id !== undefined && s.user.country_id !== null
  ).length;

  // Encontrar discrepancias de IDs
  const discrepancias = [];
  servicios.forEach((servicio) => {
    if (servicio.user && servicio.user.country_id) {
      const countryId = Number(servicio.user.country_id);
      const pais = paises.find((p) => p.id === countryId);
      if (!pais) {
        discrepancias.push({
          servicio_id: servicio.id,
          country_id: countryId,
          paises_disponibles: paises.map((p) => p.id),
        });
      }
    }
  });

  return (
    <div className="mt-4 p-4 bg-red-100 rounded-lg">
      <h3 className="font-bold text-red-800">
        🚨 Debug - Problema de Relación
      </h3>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <p>
            <strong>Servicios totales:</strong> {servicios.length}
          </p>
          <p>
            <strong>Con country_id:</strong> {serviciosConCountryId}
          </p>
          <p>
            <strong>Sin country_id:</strong>{" "}
            {servicios.length - serviciosConCountryId}
          </p>
        </div>

        <div>
          <p>
            <strong>Países en API:</strong> {paises.length}
          </p>
          <p>
            <strong>Discrepancias IDs:</strong> {discrepancias.length}
          </p>
        </div>
      </div>

      {discrepancias.length > 0 && (
        <div className="mt-3">
          <h4 className="font-semibold">❌ IDs que no coinciden:</h4>
          {discrepancias.map((item, index) => (
            <div key={index} className="text-sm border-b py-1">
              Servicio #{item.servicio_id} → CountryID: {item.country_id}
              (IDs disponibles: {item.paises_disponibles.join(", ")})
            </div>
          ))}
        </div>
      )}

      <div className="mt-3">
        <h4 className="font-semibold">🔍 IDs de Países disponibles:</h4>
        <div className="text-sm">
          {paises.map((pais) => (
            <div key={pais.id}>
              ID: {pais.id} → {pais.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
