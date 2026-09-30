import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState } from "react";

function PersonaFisica({
  persona,
  numReclamo,
  setRow,
  tipologiche
}) {

  const [expanded, setExpanded] = useState(false);
  
  const handleChange = async (e) => {
    const { name, value } = e.target;

    console.log("===== MODIFICA PERSONA FISICA =====");
    console.log("_id:", persona._id);
    console.log("field:", name);
    console.log("value:", value);

    // Aggiornamento immediato della UI
    setRow(prev => ({
      ...prev,
      personaFisica: prev.personaFisica.map(p =>
        String(p._id) === String(persona._id)
          ? {
              ...p,
              [name]: value
            }
          : p
      )
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reclami/${numReclamo}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            array: "personaFisica",
            field: name,
            value: value,
            rowData: {
              _id: persona._id
            }
          })
        }
      );

      const data = await response.json();

      console.log("RISPOSTA PATCH:", data);

      if (!response.ok) {
        console.error("Errore PATCH:", data);
      }

    } catch (error) {
      console.error("Errore salvataggio personaFisica:", error);
    }
  };
  return (
    <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
    >

      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          Persona Fisica {persona?.codFiscale ?? ''} {persona?.nome ?? ''} {persona?.cognome ?? ''}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >

          {/* =========================
              DATI PERSONALI
          ========================== */}

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >

            <TextField
              label="Codice Fiscale"
              name="codFiscale"
              value={persona.codFiscale ?? ""}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Nome"
              name="nome"
              value={persona?.nome ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Cognome"
              name="cognome"
              value={persona?.cognome ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <FormControl fullWidth>

              <InputLabel>
                Ruolo Persona Fisica
              </InputLabel>

              <Select
                name="ruoloPersonaFisica"
                value={persona?.ruoloPersonaFisica ?? ''}
                onChange={handleChange}
                label="Ruolo Persona Fisica"
              >

                <MenuItem value="">
                  <em>
                    Seleziona Ruolo Persona Fisica
                  </em>
                </MenuItem>

                {tipologiche['Ruolo Persona Fisica']?.map(
                  (valore) => (
                    <MenuItem
                      key={valore.descrizione}
                      value={valore.descrizione}
                    >
                      {valore.descrizione}
                    </MenuItem>
                  )
                )}

              </Select>

            </FormControl>

          </Box>


          {/* =========================
              DOCUMENTO IDENTITÀ
          ========================== */}

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >

            <FormControl fullWidth>

              <InputLabel>
                Documento Identità
              </InputLabel>

              <Select
                name="tipoDocIdenità"
                value={persona?.tipoDocIdenità ?? ''}
                onChange={handleChange}
                label="Documento Identità"
              >

                <MenuItem value="">
                  <em>
                    Seleziona Documento Identità
                  </em>
                </MenuItem>

                {tipologiche['Documento Identità']?.map(
                  (valore) => (
                    <MenuItem
                      key={valore.descrizione}
                      value={valore.descrizione}
                    >
                      {valore.descrizione}
                    </MenuItem>
                  )
                )}

              </Select>

            </FormControl>


            <TextField
              label="Documento Identità/Patente N°"
              name="docIdentità"
              value={persona?.docIdentità ?? ''}
               onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Scadenza Doc Identità"
              name="scadenzaDocIdentità"
              value={persona?.scadenzaDocIdentità ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Rilascio Doc Identità"
              name="rilascioDocIdentità"
              value={persona?.rilascioDocIdentità ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Ente Rilascio Doc Identità"
              name="enteRilascioDocIdentità"
              value={persona?.enteRilascioDocIdentità ?? ''}
              onChange={handleChange}
              fullWidth
            />

          </Box>


          {/* =========================
              NASCITA / RESIDENZA
          ========================== */}

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >

            <TextField
              label="Comune di Nascita"
              name="comuneNascita"
              value={persona?.comuneNascita ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Data di Nascita"
              name="dataNascita"
              value={persona?.dataNascita ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Città di Residenza"
              name="cittàResidenza"
              value={persona?.cittàResidenza ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Stato di Residenza"
              name="statoResidenza"
              value={persona?.statoResidenza ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Indirizzo"
              name="indirizzo"
              value={persona?.indirizzo ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Civico"
              name="civico"
              value={persona?.civico ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Provincia"
              name="provincia"
              value={persona?.provincia ?? ''}
              onChange={handleChange}
              fullWidth
            />

          </Box>


          {/* =========================
              CONTATTI
          ========================== */}

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >

            <TextField
              label="Telefono"
              name="telefono"
              value={persona?.telefono ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Cellulare"
              name="cellulare"
              value={persona?.cellulare ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="eMail Ufficiale"
              name="eMailUfficiale"
              value={persona?.eMailUfficiale ?? ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="PEC"
              name="pec"
              value={persona?.pec ?? ''}
              onChange={handleChange}
              fullWidth
            />

          </Box>


          {/* =========================
              AZIONI
          ========================== */}

          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >

            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                handlePersonaChange(index, {
                  target: {
                    name: '__remove__',
                    value: true,
                  },
                })
              }
            >
              Rimuovi
            </Button>

          </Box>

        </Box>

      </AccordionDetails>

    </Accordion>
  );
}

export default PersonaFisica;
