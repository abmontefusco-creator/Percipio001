import React, { useState } from "react";

import {
    Checkbox,
    CircularProgress
} from "@mui/material";


const AutoSaveCheckbox = ({
    numReclamo,
    initialChecked = false,

    array,
    rowKeyField,
    rowKey,
    field,
    rowData,

    updateField,
    isSaving,
    isSaved,
    errors
}) => {
    
    /*
     * ============================================================
     * STATO LOCALE
     * ============================================================
     */
    const [checked, setChecked] = useState(
        initialChecked
    );


    /*
     * ============================================================
     * CHIAVE OPERAZIONE
     * ============================================================
     */
    const operationKey =
        `${array}.${rowKey}.${field}`;


    /*
     * ============================================================
     * STATO AUTOSAVE
     * ============================================================
     */
    const saving = isSaving({
        array,
        rowKey,
        field
    });

    const saved = isSaved({
        array,
        rowKey,
        field
    });

    const error = errors[operationKey];



    /*
     * ============================================================
     * CLICK CHECKBOX
     * ============================================================
     */
    const handleChange = async (event, newChecked) => {

        console.log(
            "AutoSaveCheckbox CLICK",
            newChecked
        );


        /*
         * Salvo il vecchio valore.
         * Serve per il rollback in caso di errore.
         */
        const oldValue = checked;


        /*
         * Aggiornamento immediato della UI.
         */
        setChecked(newChecked);


        try {
console.log("AUTOSAVE → INVIO:", {
  array,
  rowKeyField,
  rowKey,
  field,
  value: newChecked ? 1 : 0,
  rowData
});
            /*
             * Autosave sul backend.
             */
            const result = await updateField({
                array,
                rowKeyField,
                rowKey,
                field,
                value: newChecked ? 1 : 0,
                rowData

            });


            /*
             * Se il salvataggio fallisce,
             * ripristino il valore precedente.
             */
            if (!result?.ok) {

                setChecked(oldValue);

            }

        } catch (error) {

            console.error(
                "Errore durante autosave checkbox:",
                error
            );


            /*
             * Rollback.
             */
            setChecked(oldValue);

        }

    };


    /*
     * ============================================================
     * RENDER
     * ============================================================
     */
    return (
        <>
            <Checkbox
                checked={checked}
                onChange={handleChange}
                disabled={saving}
            />

            {saving && (
                <CircularProgress
                    size={16}
                    sx={{ ml: 1 }}
                />
            )}

            {saved && !saving && (
                <span
                    style={{
                        marginLeft: 8
                    }}
                >
                    ✓
                </span>
            )}

            {error && !saving && (
                <span
                    style={{
                        marginLeft: 8,
                        color: "red"
                    }}
                    title={error}
                >
                    ⚠
                </span>
            )}
        </>
    );
};

export default AutoSaveCheckbox;