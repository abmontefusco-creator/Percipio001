const API_URL = import.meta.env.VITE_API_URL;

export async function fetchTenantData(tenantId) {
  //const response = await fetch(`https://percipio001.onrender.com/api/data/${tenantId}`);
  //const response = await fetch(`https://localhost:5000/api/data/${tenantId}`);
  const response = await fetch(
    `${API_URL}/api/data/${tenantId}`
  );
  if (!response.ok) throw new Error("Errore nel recupero dati");
  return await response.json();
}
