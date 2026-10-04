import React, { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import SendIcon from "@mui/icons-material/Send";


const API_URL = import.meta.env.VITE_API_URL;


/*
 * ------------------------------------------------------------------
 * DATI TEMPORANEI
 * ------------------------------------------------------------------
 *
 * Questi dati verranno successivamente recuperati da MongoDB.
 */

const stakeholderDisponibili = [
    {
        codice: "CLIENTE",
        descrizione: "Cliente",
        email: "cliente@example.it"
    },
    {
        codice: "UTILITY",
        descrizione: "Utility",
        email: "utility@example.it"
    },
    {
        codice: "RESPONSABILE",
        descrizione: "Responsabile processo",
        email: "responsabile@example.it"
    },
    {
        codice: "OPERATORE",
        descrizione: "Operatore",
        email: "operatore@example.it"
    }
];


const templateDisponibili = [
    {
        codice: "RICHIESTA_INTEGRAZIONE",
        descrizione: "Richiesta integrazione documentale",

        oggetto:
            "Richiesta integrazione documentale - Reclamo {{NUM_RECLAMO}}",

        corpo:
            `Gentile {{DESTINATARIO}},

con riferimento al reclamo n. {{NUM_RECLAMO}},
si comunica che è necessario procedere con un'integrazione
della documentazione.

Si prega di prendere visione della documentazione allegata.

Cordiali saluti`
    },
    {
        codice: "COMUNICAZIONE_CHIUSURA",
        descrizione: "Comunicazione chiusura processo",

        oggetto:
            "Chiusura processo - Reclamo {{NUM_RECLAMO}}",

        corpo:
            `Gentile {{DESTINATARIO}},

con riferimento al reclamo n. {{NUM_RECLAMO}},
si comunica la conclusione del processo di gestione.

Cordiali saluti`
    },
    {
        codice: "COMUNICAZIONE_GENERICA",
        descrizione: "Comunicazione generica",

        oggetto:
            "Comunicazione relativa al reclamo {{NUM_RECLAMO}}",

        corpo:
            `Gentile {{DESTINATARIO}},

con riferimento al reclamo n. {{NUM_RECLAMO}},
si trasmette la presente comunicazione.

Cordiali saluti`
    }
];


function GestioneMail({
    numReclamo = "",
    faseProcesso = "",
    processoId = ""
}) {

    /*
     * ------------------------------------------------------------------
     * STATO
     * ------------------------------------------------------------------
     */

    const [templateCodice, setTemplateCodice] = useState(
        "RICHIESTA_INTEGRAZIONE"
    );

    const [stakeholderSelezionati, setStakeholderSelezionati] =
        useState([
            "CLIENTE",
            "UTILITY"
        ]);

    const [ccSelezionati, setCcSelezionati] =
        useState([
            "RESPONSABILE"
        ]);

    const [destinatariManuali, setDestinatariManuali] =
        useState("");

    const [ccManuali, setCcManuali] =
        useState("");

    const [oggetto, setOggetto] =
        useState("");

    const [corpo, setCorpo] =
        useState("");

    const [allegati, setAllegati] =
        useState([]);

    const [sending, setSending] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [messageType, setMessageType] =
        useState("success");


    /*
     * ------------------------------------------------------------------
     * TEMPLATE SELEZIONATO
     * ------------------------------------------------------------------
     */

    const templateSelezionato = useMemo(() => {
        return templateDisponibili.find(
            template => template.codice === templateCodice
        );
    }, [templateCodice]);


    /*
     * ------------------------------------------------------------------
     * SOSTITUZIONE PARAMETRI TEMPLATE
     * ------------------------------------------------------------------
     */

    function applicaParametriTemplate(testo) {

        if (!testo) {
            return "";
        }

        return testo
            .replaceAll(
                "{{NUM_RECLAMO}}",
                numReclamo || ""
            )
            .replaceAll(
                "{{DESTINATARIO}}",
                "Destinatario"
            );
    }


    /*
     * ------------------------------------------------------------------
     * CARICAMENTO TEMPLATE
     * ------------------------------------------------------------------
     */

    function handleTemplateChange(event) {

        const codice = event.target.value;

        setTemplateCodice(codice);

        const template =
            templateDisponibili.find(
                item => item.codice === codice
            );

        if (!template) {
            return;
        }

        setOggetto(
            applicaParametriTemplate(
                template.oggetto
            )
        );

        setCorpo(
            applicaParametriTemplate(
                template.corpo
            )
        );
    }


    /*
     * ------------------------------------------------------------------
     * STAKEHOLDER
     * ------------------------------------------------------------------
     */

    function toggleStakeholder(codice) {

        setStakeholderSelezionati(prev => {

            if (prev.includes(codice)) {
                return prev.filter(
                    item => item !== codice
                );
            }

            return [
                ...prev,
                codice
            ];
        });
    }


    function toggleCc(codice) {

        setCcSelezionati(prev => {

            if (prev.includes(codice)) {
                return prev.filter(
                    item => item !== codice
                );
            }

            return [
                ...prev,
                codice
            ];
        });
    }


    /*
     * ------------------------------------------------------------------
     * EMAIL DESTINATARI
     * ------------------------------------------------------------------
     */

    const emailStakeholder =
        stakeholderDisponibili
            .filter(item =>
                stakeholderSelezionati.includes(
                    item.codice
                )
            )
            .map(item => item.email);


    const emailCc =
        stakeholderDisponibili
            .filter(item =>
                ccSelezionati.includes(
                    item.codice
                )
            )
            .map(item => item.email);


    const parseEmailString = (value) => {

        if (!value) {
            return [];
        }

        return value
            .split(/[;,]/)
            .map(email => email.trim())
            .filter(Boolean);
    };


    const destinatariFinali = [
        ...emailStakeholder,
        ...parseEmailString(destinatariManuali)
    ];


    const ccFinali = [
        ...emailCc,
        ...parseEmailString(ccManuali)
    ];


    /*
     * ------------------------------------------------------------------
     * ALLEGATI
     * ------------------------------------------------------------------
     */

    function handleAllegati(event) {

        const files =
            Array.from(event.target.files || []);

        if (!files.length) {
            return;
        }

        setAllegati(prev => [
            ...prev,
            ...files
        ]);

        event.target.value = "";
    }


    function eliminaAllegato(index) {

        setAllegati(prev =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    }


    /*
     * ------------------------------------------------------------------
     * INVIO
     * ------------------------------------------------------------------
     */

    async function handleInviaMail() {

        if (!destinatariFinali.length) {

            setMessage(
                "È necessario indicare almeno un destinatario."
            );

            setMessageType("error");

            return;
        }


        if (!oggetto.trim()) {

            setMessage(
                "L'oggetto della mail è obbligatorio."
            );

            setMessageType("error");

            return;
        }


        if (!corpo.trim()) {

            setMessage(
                "Il corpo della mail è obbligatorio."
            );

            setMessageType("error");

            return;
        }


        setSending(true);

        try {

            /*
             * Per ora inviamo solamente i dati testuali.
             *
             * Gli allegati verranno gestiti successivamente
             * tramite Supabase.
             */

            const response = await fetch(
                `${API_URL}/api/mail/invia`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        processoId,

                        numReclamo,

                        faseProcesso,

                        template:
                            templateCodice,

                        to:
                            destinatariFinali,

                        cc:
                            ccFinali,

                        subject:
                            oggetto,

                        text:
                            corpo
                    })
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Errore durante l'invio della mail"
                );
            }


            setMessage(
                "Mail inviata correttamente."
            );

            setMessageType("success");


        } catch (error) {

            console.error(
                "ERRORE INVIO MAIL:",
                error
            );

            setMessage(
                error.message ||
                "Errore durante l'invio della mail"
            );

            setMessageType("error");

        } finally {

            setSending(false);
        }
    }


    /*
     * ------------------------------------------------------------------
     * RESET
     * ------------------------------------------------------------------
     */

    function handleReset() {

        setStakeholderSelezionati([]);

        setCcSelezionati([]);

        setDestinatariManuali("");

        setCcManuali("");

        setOggetto("");

        setCorpo("");

        setAllegati([]);
    }


    /*
     * ------------------------------------------------------------------
     * RENDER
     * ------------------------------------------------------------------
     */

    return (

        <Box
            sx={{
                p: 3,
                maxWidth: 1400,
                margin: "0 auto"
            }}
        >

            {/* ------------------------------------------------------ */}
            {/* HEADER */}
            {/* ------------------------------------------------------ */}

            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 3 }}
            >

                <EmailIcon
                    sx={{
                        fontSize: 36
                    }}
                />

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Gestione Mail
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Preparazione e invio della
                        comunicazione agli stakeholder
                    </Typography>

                </Box>

            </Stack>


            {/* ------------------------------------------------------ */}
            {/* INFORMAZIONI PROCESSO */}
            {/* ------------------------------------------------------ */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        sx={{ mb: 2 }}
                    >
                        Processo
                    </Typography>


                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={2}
                    >

                        <TextField
                            label="Numero Reclamo"
                            value={numReclamo}
                            InputProps={{
                                readOnly: true
                            }}
                            fullWidth
                        />

                        <TextField
                            label="Fase processo"
                            value={faseProcesso}
                            InputProps={{
                                readOnly: true
                            }}
                            fullWidth
                        />

                        <TextField
                            label="Processo ID"
                            value={processoId}
                            InputProps={{
                                readOnly: true
                            }}
                            fullWidth
                        />

                    </Stack>

                </CardContent>

            </Card>


            {/* ------------------------------------------------------ */}
            {/* CONFIGURAZIONE */}
            {/* ------------------------------------------------------ */}

            <Stack
                direction={{
                    xs: "column",
                    md: "row"
                }}
                spacing={3}
            >

                {/* ================================================== */}
                {/* COLONNA SINISTRA */}
                {/* ================================================== */}

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0
                    }}
                >

                    {/* ------------------------------------------------ */}
                    {/* TEMPLATE */}
                    {/* ------------------------------------------------ */}

                    <Card sx={{ mb: 3 }}>

                        <CardContent>

                            <Typography
                                variant="h6"
                                sx={{ mb: 2 }}
                            >
                                Comunicazione
                            </Typography>


                            <FormControl
                                fullWidth
                                sx={{ mb: 2 }}
                            >

                                <InputLabel>
                                    Template
                                </InputLabel>

                                <Select
                                    value={templateCodice}
                                    label="Template"
                                    onChange={
                                        handleTemplateChange
                                    }
                                >

                                    {templateDisponibili.map(
                                        template => (

                                            <MenuItem
                                                key={
                                                    template.codice
                                                }
                                                value={
                                                    template.codice
                                                }
                                            >
                                                {
                                                    template.descrizione
                                                }
                                            </MenuItem>

                                        )
                                    )}

                                </Select>

                            </FormControl>


                            <TextField
                                label="Oggetto"
                                value={oggetto}
                                onChange={event =>
                                    setOggetto(
                                        event.target.value
                                    )
                                }
                                fullWidth
                                sx={{ mb: 2 }}
                            />


                            <TextField
                                label="Messaggio"
                                value={corpo}
                                onChange={event =>
                                    setCorpo(
                                        event.target.value
                                    )
                                }
                                fullWidth
                                multiline
                                minRows={12}
                            />

                        </CardContent>

                    </Card>


                    {/* ------------------------------------------------ */}
                    {/* ALLEGATI */}
                    {/* ------------------------------------------------ */}

                    <Card>

                        <CardContent>

                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >

                                <Typography
                                    variant="h6"
                                >
                                    Allegati
                                </Typography>


                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={
                                        <AttachFileIcon />
                                    }
                                >
                                    Aggiungi allegato

                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        onChange={
                                            handleAllegati
                                        }
                                    />

                                </Button>

                            </Stack>


                            {allegati.length === 0 ? (

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Nessun allegato selezionato.
                                </Typography>

                            ) : (

                                <Stack spacing={1}>

                                    {allegati.map(
                                        (file, index) => (

                                            <Paper
                                                key={`${file.name}-${index}`}
                                                variant="outlined"
                                                sx={{
                                                    p: 1,
                                                    px: 2
                                                }}
                                            >

                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                >

                                                    <Typography>
                                                        {file.name}
                                                    </Typography>

                                                    <Button
                                                        color="error"
                                                        size="small"
                                                        onClick={() =>
                                                            eliminaAllegato(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <DeleteIcon />
                                                    </Button>

                                                </Stack>

                                            </Paper>

                                        )
                                    )}

                                </Stack>

                            )}

                        </CardContent>

                    </Card>

                </Box>


                {/* ================================================== */}
                {/* COLONNA DESTRA */}
                {/* ================================================== */}

                <Box
                    sx={{
                        width: {
                            xs: "100%",
                            md: 430
                        }
                    }}
                >

                    {/* ------------------------------------------------ */}
                    {/* DESTINATARI */}
                    {/* ------------------------------------------------ */}

                    <Card sx={{ mb: 3 }}>

                        <CardContent>

                            <Typography
                                variant="h6"
                                sx={{ mb: 2 }}
                            >
                                Destinatari
                            </Typography>


                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1 }}
                            >
                                Stakeholder
                            </Typography>


                            <Stack>

                                {stakeholderDisponibili.map(
                                    stakeholder => (

                                        <FormControlLabel
                                            key={
                                                stakeholder.codice
                                            }
                                            control={
                                                <Checkbox
                                                    checked={
                                                        stakeholderSelezionati.includes(
                                                            stakeholder.codice
                                                        )
                                                    }
                                                    onChange={() =>
                                                        toggleStakeholder(
                                                            stakeholder.codice
                                                        )
                                                    }
                                                />
                                            }
                                            label={
                                                <Box>

                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        {
                                                            stakeholder.descrizione
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {
                                                            stakeholder.email
                                                        }
                                                    </Typography>

                                                </Box>
                                            }
                                        />

                                    )
                                )}

                            </Stack>


                            <TextField
                                label="Altri destinatari"
                                placeholder="email1@example.it; email2@example.it"
                                value={
                                    destinatariManuali
                                }
                                onChange={event =>
                                    setDestinatariManuali(
                                        event.target.value
                                    )
                                }
                                fullWidth
                                multiline
                                minRows={2}
                                sx={{ mt: 2 }}
                            />


                            <Divider
                                sx={{ my: 3 }}
                            />


                            <Typography
                                variant="subtitle2"
                                sx={{ mb: 1 }}
                            >
                                CC
                            </Typography>


                            <Stack>

                                {stakeholderDisponibili.map(
                                    stakeholder => (

                                        <FormControlLabel
                                            key={`cc-${stakeholder.codice}`}
                                            control={
                                                <Checkbox
                                                    checked={
                                                        ccSelezionati.includes(
                                                            stakeholder.codice
                                                        )
                                                    }
                                                    onChange={() =>
                                                        toggleCc(
                                                            stakeholder.codice
                                                        )
                                                    }
                                                />
                                            }
                                            label={
                                                stakeholder.descrizione
                                            }
                                        />

                                    )
                                )}

                            </Stack>


                            <TextField
                                label="Altri destinatari CC"
                                placeholder="email@example.it"
                                value={ccManuali}
                                onChange={event =>
                                    setCcManuali(
                                        event.target.value
                                    )
                                }
                                fullWidth
                                multiline
                                minRows={2}
                                sx={{ mt: 2 }}
                            />

                        </CardContent>

                    </Card>


                    {/* ------------------------------------------------ */}
                    {/* RIEPILOGO */}
                    {/* ------------------------------------------------ */}

                    <Card>

                        <CardContent>

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >

                                <PreviewIcon />

                                <Typography
                                    variant="h6"
                                >
                                    Riepilogo
                                </Typography>

                            </Stack>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                Destinatari
                            </Typography>


                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ mb: 2 }}
                            >

                                {destinatariFinali.map(
                                    email => (

                                        <Chip
                                            key={email}
                                            label={email}
                                            size="small"
                                        />

                                    )
                                )}

                            </Stack>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                CC
                            </Typography>


                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ mb: 2 }}
                            >

                                {ccFinali.map(
                                    email => (

                                        <Chip
                                            key={email}
                                            label={email}
                                            size="small"
                                        />

                                    )
                                )}

                            </Stack>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                Oggetto
                            </Typography>


                            <Typography
                                variant="body2"
                                sx={{ mb: 2 }}
                            >
                                {oggetto ||
                                    "Nessun oggetto"}
                            </Typography>


                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                Allegati
                            </Typography>


                            <Typography
                                variant="body2"
                            >
                                {allegati.length} file
                            </Typography>

                        </CardContent>

                    </Card>

                </Box>

            </Stack>


            {/* ------------------------------------------------------ */}
            {/* ANTEPRIMA */}
            {/* ------------------------------------------------------ */}

            <Card sx={{ mt: 3 }}>

                <CardContent>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >

                        <PreviewIcon />

                        <Typography
                            variant="h6"
                        >
                            Anteprima della mail
                        </Typography>

                    </Stack>


                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            backgroundColor: "#fafafa"
                        }}
                    >

                        <Typography
                            variant="body2"
                            sx={{ mb: 1 }}
                        >
                            <strong>A:</strong>{" "}
                            {destinatariFinali.join(
                                ", "
                            ) || "Nessun destinatario"}
                        </Typography>


                        {ccFinali.length > 0 && (

                            <Typography
                                variant="body2"
                                sx={{ mb: 1 }}
                            >
                                <strong>CC:</strong>{" "}
                                {ccFinali.join(", ")}
                            </Typography>

                        )}


                        <Typography
                            variant="body2"
                            sx={{ mb: 2 }}
                        >
                            <strong>Oggetto:</strong>{" "}
                            {oggetto}
                        </Typography>


                        <Divider
                            sx={{ mb: 2 }}
                        />


                        <Typography
                            component="div"
                            sx={{
                                whiteSpace: "pre-wrap"
                            }}
                        >
                            {corpo}
                        </Typography>


                        {allegati.length > 0 && (

                            <>

                                <Divider
                                    sx={{ my: 2 }}
                                />

                                <Typography
                                    variant="subtitle2"
                                    sx={{ mb: 1 }}
                                >
                                    Allegati
                                </Typography>

                                {allegati.map(
                                    (file, index) => (

                                        <Typography
                                            key={`${file.name}-preview-${index}`}
                                            variant="body2"
                                        >
                                            📎 {file.name}
                                        </Typography>

                                    )
                                )}

                            </>

                        )}

                    </Paper>

                </CardContent>

            </Card>


            {/* ------------------------------------------------------ */}
            {/* AZIONI */}
            {/* ------------------------------------------------------ */}

            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                sx={{ mt: 3 }}
            >

                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleReset}
                    disabled={sending}
                >
                    Azzera
                </Button>


                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleInviaMail}
                    disabled={sending}
                >
                    {sending
                        ? "Invio in corso..."
                        : "Invia Mail"}
                </Button>

            </Stack>


            {/* ------------------------------------------------------ */}
            {/* MESSAGGIO */}
            {/* ------------------------------------------------------ */}

            <Snackbar
                open={Boolean(message)}
                autoHideDuration={5000}
                onClose={() =>
                    setMessage("")
                }
            >

                <Alert
                    severity={messageType}
                    onClose={() =>
                        setMessage("")
                    }
                    variant="filled"
                >
                    {message}
                </Alert>

            </Snackbar>

        </Box>
    );
}


export default GestioneMail;
