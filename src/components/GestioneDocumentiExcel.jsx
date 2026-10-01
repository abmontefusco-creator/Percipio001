import React, { useEffect, useRef, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  CheckCircle,
  CloudUpload,
  Delete,
  Download,
  Cancel,
} from "@mui/icons-material";

import {
  getDocumentiConfigurazione,
  salvaDocumentoConfigurazione,
  aggiornaValiditaDocumento,
  eliminaDocumentoConfigurazione
} from "../services/documentoConfigurazioneService";


import { supabase } from "../services/supabaseClient";

const TIPI_DOCUMENTO = [
  {
    key: "TIPOLOGIE",
    label: "Tipologie",
  },
  {
    key: "ARERA",
    label: "Arera",
  },
  {
    key: "LETTERE",
    label: "Lettere",
  },
  {
    key: "TEMPLATE_FINITE",
    label: "Template finiti",
  },
];


function TabPanel({ children, value, index }) {
  if (value !== index) {
    return null;
  }

  return (
    <Box sx={{ pt: 3 }}>
      {children}
    </Box>
  );
}


function GestioneDocumentiExcel() {
  const [tab, setTab] = useState(0);

  const [documenti, setDocumenti] = useState([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  const tipoDocumento = TIPI_DOCUMENTO[tab].key;
  const labelTipoDocumento = TIPI_DOCUMENTO[tab].label;


  useEffect(() => {
    caricaDocumenti();
  }, [tipoDocumento]);


  async function caricaDocumenti() {
    setLoading(true);
    setError("");

    try {
      const data =
        await getDocumentiConfigurazione(tipoDocumento);

      setDocumenti(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Errore durante il caricamento dei documenti"
      );
    } finally {
      setLoading(false);
    }
  }


  function handleTabChange(event, newValue) {
    setTab(newValue);
  }


  function handleClickUpload() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const nome = file.name.toLowerCase();

    if (
      !nome.endsWith(".xlsx") &&
      !nome.endsWith(".xls")
    ) {
      setError(
        "È possibile caricare solamente file Excel (.xls o .xlsx)"
      );

      return;
    }

    setUploading(true);
    setError("");

    try {

      /*
      * =====================================================
      * 1. CREAZIONE PATH SUPABASE
      * =====================================================
      */

      const fileName = `${Date.now()}_${file.name}`;

      const filePath =
        `reclami/0/${tipoDocumento}/${fileName}`;


      console.log("UPLOAD DOCUMENTO CONFIGURAZIONE:", {
        tipoDocumento,
        fileName,
        filePath,
        size: file.size,
        type: file.type
      });


      /*
      * =====================================================
      * 2. UPLOAD SU SUPABASE
      * =====================================================
      */

      const {
        data,
        error
      } = await supabase.storage
        .from("reclami")
        .upload(filePath, file);


      if (error) {
        throw error;
      }


      console.log(
        "UPLOAD SUPABASE RIUSCITO:",
        data
      );


      /*
      * =====================================================
      * 3. SALVATAGGIO METADATA SU MONGO
      * =====================================================
      */

      const documento = {

        nomeFile: file.name,

        tipoDocumento,

        reclamo: 0,

        valido: false,

        path: filePath,

        fullPath: data.fullPath,

        versione: 1

      };


      console.log(
        "SALVATAGGIO DOCUMENTO MONGO:",
        documento
      );


      const risultato =
        await salvaDocumentoConfigurazione(
          documento
        );


      console.log(
        "DOCUMENTO SALVATO SU MONGO:",
        risultato
      );


      /*
      * =====================================================
      * 4. AGGIORNAMENTO LISTA
      * =====================================================
      */

      setSuccess(
        `File "${file.name}" caricato correttamente`
      );

      await caricaDocumenti();


    } catch (err) {

      console.error(
        "ERRORE UPLOAD DOCUMENTO:",
        err
      );

      setError(
        err.message ||
        "Errore durante il caricamento del file"
      );

    } finally {

      setUploading(false);

    }
  }

  async function handleToggleValido(documento) {
    const nuovoValore = !documento.valido;

    // aggiornamento ottimistico
    setDocumenti((prev) =>
      prev.map((item) =>
        item._id === documento._id
          ? {
              ...item,
              valido: nuovoValore,
            }
          : item
      )
    );

    try {
      await aggiornaValiditaDocumento(
        documento._id,
        nuovoValore
      );

      setSuccess(
        nuovoValore
          ? `"${documento.nomeFile}" impostato come valido`
          : `"${documento.nomeFile}" impostato come non valido`
      );
    } catch (err) {
      console.error(err);

      // ripristino se il backend fallisce
      setDocumenti((prev) =>
        prev.map((item) =>
          item._id === documento._id
            ? {
                ...item,
                valido: documento.valido,
              }
            : item
        )
      );

      setError(
        err.message ||
        "Errore durante l'aggiornamento"
      );
    }
  }


  async function handleDelete(documento) {
    const conferma = window.confirm(
      `Vuoi eliminare il file "${documento.nomeFile}"?`
    );

    if (!conferma) {
      return;
    }

    try {
      await eliminaDocumentoConfigurazione(
        documento._id
      );

      setDocumenti((prev) =>
        prev.filter(
          (item) => item._id !== documento._id
        )
      );

      setSuccess(
        `File "${documento.nomeFile}" eliminato`
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
        "Errore durante l'eliminazione"
      );
    }
  }


  function handleDownload(documento) {
    if (documento.publicUrl) {
      window.open(
        documento.publicUrl,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    if (documento.url) {
      window.open(
        documento.url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  }


  function formatData(data) {
    if (!data) {
      return "-";
    }

    const parsed = new Date(data);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleString("it-IT");
  }


  return (
    <Box sx={{ p: 3 }}>

      <Typography
        variant="h5"
        sx={{
          mb: 1,
          fontWeight: 600,
        }}
      >
        Gestione documenti Excel
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Gestione dei documenti di configurazione utilizzati
        dall'applicazione.
      </Typography>


      <Paper elevation={2}>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {TIPI_DOCUMENTO.map((tipo) => (
            <Tab
              key={tipo.key}
              label={tipo.label}
            />
          ))}
        </Tabs>


        {TIPI_DOCUMENTO.map((tipo, index) => (

          <TabPanel
            key={tipo.key}
            value={tab}
            index={index}
          >

            <Box sx={{ px: 3, pb: 3 }}>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >

                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                  >
                    {labelTipoDocumento}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Documenti configurazione globali
                    (Reclamo = 0)
                  </Typography>
                </Box>


                <Box>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xls,.xlsx"
                    style={{ display: "none" }}
                    onChange={handleFileSelected}
                  />

                  <Button
                    variant="contained"
                    startIcon={
                      uploading ? (
                        <CircularProgress
                          size={18}
                          color="inherit"
                        />
                      ) : (
                        <CloudUpload />
                      )
                    }
                    disabled={uploading}
                    onClick={handleClickUpload}
                  >
                    {uploading
                      ? "Caricamento..."
                      : "Carica nuovo file"}
                  </Button>

                </Box>

              </Box>


              {loading ? (

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 6,
                  }}
                >
                  <CircularProgress />
                </Box>

              ) : documenti.length === 0 ? (

                <Alert severity="info">
                  Nessun file presente per
                  <strong> {labelTipoDocumento}</strong>.
                </Alert>

              ) : (

                <TableContainer
                  component={Paper}
                  variant="outlined"
                >

                  <Table>

                    <TableHead>

                      <TableRow>

                        <TableCell>
                          Nome file
                        </TableCell>

                        <TableCell>
                          Data caricamento
                        </TableCell>

                        <TableCell>
                          Versione
                        </TableCell>

                        <TableCell align="center">
                          Stato
                        </TableCell>

                        <TableCell align="center">
                          Azioni
                        </TableCell>

                      </TableRow>

                    </TableHead>


                    <TableBody>

                      {documenti.map((documento) => (

                        <TableRow
                          key={documento._id}
                          hover
                        >

                          <TableCell>

                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 500,
                              }}
                            >
                              {documento.nomeFile}
                            </Typography>

                          </TableCell>


                          <TableCell>

                            {formatData(
                              documento.dataCaricamento ||
                              documento.createdAt
                            )}

                          </TableCell>


                          <TableCell>

                            {documento.versione ?? "-"}

                          </TableCell>


                          <TableCell align="center">

                            <Chip
                              icon={
                                documento.valido ? (
                                  <CheckCircle />
                                ) : (
                                  <Cancel />
                                )
                              }
                              label={
                                documento.valido
                                  ? "Valido"
                                  : "Non valido"
                              }
                              color={
                                documento.valido
                                  ? "success"
                                  : "default"
                              }
                              variant={
                                documento.valido
                                  ? "filled"
                                  : "outlined"
                              }
                              onClick={() =>
                                handleToggleValido(
                                  documento
                                )
                              }
                              sx={{
                                cursor: "pointer",
                              }}
                            />

                          </TableCell>


                          <TableCell align="center">

                            <Tooltip title="Scarica">

                              <span>

                                <IconButton
                                  onClick={() =>
                                    handleDownload(
                                      documento
                                    )
                                  }
                                  disabled={
                                    !documento.publicUrl &&
                                    !documento.url
                                  }
                                >
                                  <Download />
                                </IconButton>

                              </span>

                            </Tooltip>


                            <Tooltip title="Elimina">

                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleDelete(
                                    documento
                                  )
                                }
                              >
                                <Delete />
                              </IconButton>

                            </Tooltip>

                          </TableCell>

                        </TableRow>

                      ))}

                    </TableBody>

                  </Table>

                </TableContainer>

              )}

            </Box>

          </TabPanel>

        ))}

      </Paper>


      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert
          severity="error"
          onClose={() => setError("")}
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>


      <Snackbar
        open={Boolean(success)}
        autoHideDuration={3500}
        onClose={() => setSuccess("")}
      >
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
          variant="filled"
        >
          {success}
        </Alert>
      </Snackbar>

    </Box>
  );
}


export default GestioneDocumentiExcel;
