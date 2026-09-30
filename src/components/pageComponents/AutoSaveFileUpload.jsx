import React, { useRef, useState } from "react";
import { supabase } from "../../services/supabaseClient";

function AutoSaveFileUpload({ numReclamo, rowId }) {

    const inputRef = useRef(null);

    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [error, setError] = useState(null);

    console.log("data:", JSON.stringify(rowId, null, 2));
    const handleFileChange = async (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError(null);
        setUploadedFile(null);
        setUploading(true);

        try {

            // Controllo parametri
            if (!numReclamo) {
                throw new Error("NumReclamo mancante");
            }

            if (!rowId) {
                throw new Error("ID della riga mancante");
            }

            // Nome univoco del file
            const fileName = `${Date.now()}_${file.name}`;

            // Struttura:
            // reclami/
            //   NumReclamo/
            //     rowId/
            //       file
            const filePath = `reclami/${numReclamo}/${rowId}/${fileName}`;

            console.log("UPLOAD FILE:", {
                numReclamo,
                rowId,
                fileName,
                filePath,
                size: file.size,
                type: file.type
            });

            const { data, error } = await supabase.storage
                .from("reclami")
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            console.log("UPLOAD RIUSCITO:", data);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/reclami/${numReclamo}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        array: "profilazioneRischi",
                        rowId: rowId,
                        field: "upload",
                        value: {
                            name: file.name,
                            path: filePath,
                            id: data.id,
                            fullPath: data.fullPath
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Upload riuscito, ma errore nel salvataggio su MongoDB"
                );
            }

            const patchResult = await response.json();

            console.log("PATCH FILE RIUSCITA:", patchResult);

            setUploadedFile({
                name: file.name,
                path: filePath
            });
            
        } catch (err) {

            console.error("Errore upload:", err);

            setError(err.message);

        } finally {

            setUploading(false);

            // Permette di ricaricare anche lo stesso file
            event.target.value = "";
        }
    };

    return (
        <div>

            <input
                ref={inputRef}
                type="file"
                hidden
                onChange={handleFileChange}
            />

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
            >
                {uploading
                    ? "Caricamento..."
                    : "📎 Carica file"
                }
            </button>

            {uploadedFile && (
                <div>
                    File caricato: {uploadedFile.name}
                </div>
            )}

            {error && (
                <div style={{ color: "red" }}>
                    Errore: {error}
                </div>
            )}

        </div>
    );
}

export default AutoSaveFileUpload;