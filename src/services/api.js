export async function fetchTenantData(tenantId) {
  const response = await fetch(`https://percipio001.onrender.com/api/data/${tenantId}`);
  if (!response.ok) throw new Error("Errore nel recupero dati");
  return await response.json();
}
