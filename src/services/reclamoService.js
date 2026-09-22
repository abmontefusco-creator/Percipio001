const API_URL = import.meta.env.VITE_API_URL;

const aggiornaCampoReclamo = async ({
    numReclamo,
    field,
    value,
    array,
    rowData
}) => {
    const response = await fetch(
        `${API_URL}/api/reclami/${numReclamo}`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                field,
                value,
                array,
                rowData
            })
        }
    );


    if (!response.ok) {

        const text = await response.text();

        throw new Error(
            text || "Errore durante il salvataggio"
        );
    }


    return response.json();
};


export default aggiornaCampoReclamo;
