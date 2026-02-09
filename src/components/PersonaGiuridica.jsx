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

function PersonaGiuridica({ form, setForm, tipologiche, handleChange }) {

  const handlePersonaGiuridicaChange = (id, e) => {
    const { name, value } = e.target;

    const persone = form.personaGiuridica.map(p =>
      p.id === id ? { ...p, [name]: value } : p
    );

    setForm({
      ...form,
      personaGiuridica: persone
    });
  };

  const aggiungiPersonaGiuridica = () => {
    setForm({
      ...form,
      personaGiuridica: [
        ...form.personaGiuridica,
        { id: crypto.randomUUID(), nome: '', pec: '' }
      ]
    });
  };

  const rimuoviPersonaGiuridica = (id) => {
    setForm({
      ...form,
      personaGiuridica: form.personaGiuridica.filter(p => p.id !== id)
    });
  };

  return (
    <>
      {form.personaGiuridica.map((personaGiuridica, index) => (
        <Accordion key={personaGiuridica.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Azienda {personaGiuridica.ragioneSociale}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            
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
                  value={personaGiuridica.pIVA}
                  onChange={(e) =>
                    handlePersonaGiuridicaChange(personaGiuridica.id, e)
                  }
                  fullWidth
                />
                <TextField
                  label="Ragione Sociale"
                  name="ragioneSociale"
                  value={personaGiuridica.ragioneSociale}
                  onChange={(e) =>
                    handlePersonaGiuridicaChange(personaGiuridica.id, e)
                  }
                  fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel>Ruolo Persona Giuridica</InputLabel>
                    <Select
                    name="Ruolo Persona Giuridica"
                    value={personaGiuridica.ruoloPersonaGiuridica}
                    onChange={handleChange}
                    label="ruoloPersonaGiuridica"
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
                  value={personaGiuridica.città}
                  onChange={(e) => handlePersonaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Indirizzo"
                  name="Indirizzo"
                  value={personaGiuridica.indirizzo}
                  onChange={(e) => handlePersonaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Civico"
                  name="Civico"
                  value={personaGiuridica.civico}
                  onChange={(e) => handlePersonaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Provincia"
                  name="Provincia"
                  value={personaGiuridica.provincia}
                  onChange={(e) => handlePersonaChange(index, e)}
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
                  value={personaGiuridica.telefono}
                  onChange={(e) => handlePersonaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Cellulare"
                  name="Cellulare"
                  value={personaGiuridica.cellulare}
                  onChange={(e) => handlePersonaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="eMail Ufficiale"
                  name="eMail Ufficiale"
                  value={personaGiuridica.eMailUfficiale}
                  onChange={(e) => handlePersonaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="PEC"
                  name="PEC"
                  value={personaGiuridica.pec}
                  onChange={(e) => handlePersonaChange(index, e)}
                  fullWidth
                />
              </Box>
              <Box mt={2}>
                <Button
                        variant="outlined"
                        color="error"
                        onClick={() => rimuoviPersonaGiuridica(personaGiuridica.id)}
                        disabled={form.personaGiuridica.length === 1}
                      >
                        Rimuovi azienda
                      </Button>

                      <Button variant="contained" onClick={aggiungiPersonaGiuridica}>
                        Aggiungi azienda
                      </Button>
              </Box>
          </AccordionDetails>
        </Accordion>
      ))}


    </>
  );
}

export default PersonaGiuridica;
