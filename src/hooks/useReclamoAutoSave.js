import { useState, useCallback } from "react";
import aggiornaCampoReclamo from "../services/reclamoService";

const useReclamoAutoSave = (numReclamo) => {

    const [saving, setSaving] = useState({});
    const [saved, setSaved] = useState({});
    const [errors, setErrors] = useState({});


    const updateField = useCallback(async ({
        field,
        value,
        array,
        rowData
    }) => {

        /*
         * La chiave locale della riga è composta
         * da tutti i campi tranne quello che stiamo modificando.
         */
        const rowKey = rowData
            ? Object.entries(rowData)
                .filter(([key]) => key !== field)
                .map(([key, value]) => `${key}=${value}`)
                .join("|")
            : "";


        /*
         * Identificativo locale dell'operazione.
         *
         * Esempio:
         * profilazioneARERA.nome=Morosità e Sospensione|codice=MOR.presente
         */
        const operationKey = array
            ? `${array}.${rowKey}.${field}`
            : field;


        /*
         * STATO: SALVATAGGIO IN CORSO
         */
        setSaving(prev => ({
            ...prev,
            [operationKey]: true
        }));


        setSaved(prev => ({
            ...prev,
            [operationKey]: false
        }));


        setErrors(prev => ({
            ...prev,
            [operationKey]: null
        }));


        try {

            await aggiornaCampoReclamo({
                numReclamo,
                field,
                value,
                array,
                rowData
            });


            /*
             * SALVATAGGIO OK
             */
            setSaved(prev => ({
                ...prev,
                [operationKey]: true
            }));


            return {
                ok: true
            };


        } catch (error) {

            console.error(
                "Errore autosave:",
                error
            );


            setErrors(prev => ({
                ...prev,
                [operationKey]: error.message
            }));


            return {
                ok: false,
                error
            };


        } finally {

            setSaving(prev => ({
                ...prev,
                [operationKey]: false
            }));

        }

    }, [numReclamo]);


    /*
     * Funzione per sapere se una specifica cella
     * è in fase di salvataggio.
     */
    const isSaving = useCallback(({
        field,
        array,
        rowData
    }) => {

        const rowKey = rowData
            ? Object.entries(rowData)
                .filter(([key]) => key !== field)
                .map(([key, value]) => `${key}=${value}`)
                .join("|")
            : "";


        const operationKey = array
            ? `${array}.${rowKey}.${field}`
            : field;


        return !!saving[operationKey];

    }, [saving]);


    /*
     * Funzione per sapere se una specifica cella
     * è stata salvata.
     */
    const isSaved = useCallback(({
        field,
        array,
        rowData
    }) => {

        const rowKey = rowData
            ? Object.entries(rowData)
                .filter(([key]) => key !== field)
                .map(([key, value]) => `${key}=${value}`)
                .join("|")
            : "";


        const operationKey = array
            ? `${array}.${rowKey}.${field}`
            : field;


        return !!saved[operationKey];

    }, [saved]);


    return {
        updateField,
        isSaving,
        isSaved,
        errors
    };
};

export default useReclamoAutoSave;