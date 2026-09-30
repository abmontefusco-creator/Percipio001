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


function PersonaGiuridica({
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
      personaGiuridica: prev.personaGiuridica.map(p =>
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
            array: "personaGiuridica",
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
      console.error("Errore salvataggio personaGiuridica:", error);
    }
  };
  return (
    <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
    >

      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          Persona Giuridica  {persona?.ragioneSociale ?? ''} {persona?.pIVA ?? ''}
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
                  label="Partita Iva"
                  name="pIVA"
                  value={persona.pIVA ?? ""}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Ragione Sociale"
                  name="ragioneSociale"
                  value={persona.ragioneSociale ?? ""}
                  onChange={handleChange}                  
                  fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel>Ruolo Persona Giuridica</InputLabel>
                    <Select
                    name="ruoloPersonaGiuridica"
                    value={persona.ruoloPersonaGiuridica ?? ""}
                    onChange={handleChange}
                    label="Ruolo Persona Giuridica"
                    >
                    <MenuItem value="">
                        <em>Seleziona Ruolo Persona Giuridica</em>
                    </MenuItem>
                    {tipologiche['Ruolo Persona Giuridica']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
              <TextField
                  label="Città Residenza"
                  name="città"
                  value={persona.città ?? ""}
                  onChange={handleChange}
                  fullWidth
                />
              <TextField
                  label="Indirizzo"
                  name="Indirizzo"
                  value={persona.indirizzo ?? ""}
                  onChange={handleChange}
                  fullWidth
                />
              <TextField
                  label="Civico"
                  name="Civico"
                  value={persona.civico ?? ""}
                  onChange={handleChange}
                  fullWidth
                />
              <TextField
                  label="Provincia"
                  name="Provincia"
                  value={persona.provincia ?? ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
              <TextField
                  label="Telefono"
                  name="Telefono"
                  value={persona.telefono ?? ""}
                  onChange={handleChange}
                  fullWidth
                />
              <TextField
                  label="Cellulare"
                  name="Cellulare"
                  value={persona.cellulare ?? ""}
                  onChange={handleChange}
                  fullWidth
                />
              <TextField
                  label="eMail Ufficiale"
                  name="eMail Ufficiale"
                  value={persona.eMailUfficiale ?? ""}
                  onChange={handleChange}
                  fullWidth
                />
              <TextField
                  label="PEC"
                  name="PEC"
                  value={persona.pec ?? ""}
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

export default PersonaGiuridica;
