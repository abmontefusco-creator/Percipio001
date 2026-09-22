import React, { useRef, useState } from "react";
import { supabase } from "../../services/supabaseClient";

function AutoSaveFileUpload({ numReclamo }) {

    const inputRef = useRef(null);

    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = async (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError(null);
        setUploadedFile(null);
        setUploading(true);

        try {

            const fileName = `${Date.now()}_${file.name}`;

            const filePath = `reclami/${numReclamo}/${fileName}`;

            console.log("UPLOAD FILE:", {
                numReclamo,
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
                {uploading ? "Caricamento..." : "📎 Carica file"}
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