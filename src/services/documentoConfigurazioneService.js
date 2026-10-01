import { API_URL } from "./api";

const BASE_URL = `${API_URL}/api/documenti-configurazione`;

export async function getDocumentiConfigurazione(tipoDocumento) {
  const response = await fetch(
    `${BASE_URL}?reclamo=0&tipoDocumento=${encodeURIComponent(
      tipoDocumento
    )}`
  );

  if (!response.ok) {
    throw new Error("Errore nel recupero dei documenti");
  }

  return response.json();
}


/*
 * Salva su MongoDB solamente i metadati
 * del file già caricato su Supabase.
 */
export async function salvaDocumentoConfigurazione(documento) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(documento)
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      text || "Errore durante il salvataggio del documento"
    );
  }

  return response.json();
}


export async function aggiornaValiditaDocumento(
  id,
  valido
) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      valido
    })
  });

  if (!response.ok) {
    throw new Error(
      "Errore durante l'aggiornamento dello stato"
    );
  }

  return response.json();
}


export async function eliminaDocumentoConfigurazione(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(
      "Errore durante l'eliminazione"
    );
  }

  return response.json();
}