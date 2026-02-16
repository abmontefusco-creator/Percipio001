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

function PersonaFisica({ form, setForm, tipologiche, handlePersonaChange }) {


  const handlePersonaFisicaChange = (id, e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      personaFisica: prev.personaFisica.map(p =>
        p.id === id
          ? { ...p, [name]: value }   // ← fondamentale lo spread
          : p
      )
    }));
  };
 
  /* const handlePersonaFisicaChange = (id, e) => {
    const { name, value } = e.target;

    const persona = form.personaFisica.map(p =>
      p.id === id ? { ...p, [name]: value } : p

    );

    setForm({
      ...form,
      personaFisica: persona
    });
  }; */

  const aggiungiPersonaFisica = () => {
    setForm({
      ...form,
      personaFisica: [
        ...form.personaFisica,
        { id: crypto.randomUUID(), nome: '', pec: '' }
      ]
    });
  };

  const rimuoviPersonaFisica = (id) => {
    setForm({
      ...form,
      personaFisica: form.personaFisica.filter(p => p.id !== id)
    });
  };

  return (
    <>
          {/* Accordion 2: Persone Fisiche */}
      {form.personaFisica.map((persona, index) => (
            
      <Accordion   key={persona.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Persone Fisiche</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <TextField
                  label="Codice Fiscale"
                  name="codiceFiscale"
                  value={persona.codiceFiscale || ''}
                  onChange={(e) => handlePersonaFisicaChange(persona.id, e)}
                  fullWidth
                />
                <TextField
                  label="Nome"
                  name="nome"
                  value={persona.nome || ''}
                  onChange={(e) => handlePersonaFisicaChange(persona.id, e)}
                  fullWidth
                />
                <TextField
                  label="Cognome"
                  name="cognome"
                  value={persona.cognome}
                  onChange={(e) => handlePersonaFisicaChange(persona.id, e)}
                  fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel>Ruolo Persona Fisica</InputLabel>
                    <Select
                    name="ruoloPersonaFisica"
                    value={persona.ruoloPersonaFisica}
                    onChange={handlePersonaFisicaChange}
                    label="ruoloPersonaFisica"
                    >
                    <MenuItem value="">
                        <em>Seleziona Ruolo Persona Fisica</em>
                    </MenuItem>
                    {tipologiche['Ruolo Persona Fisica']?.map((valore) => (
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

                <FormControl fullWidth>
                    <InputLabel>Documento Identità</InputLabel>
                    <Select
                    name="tipoDocIdenità"
                    value={persona.tipoDocIdenità}
                    onChange={handlePersonaFisicaChange}
                    label="tipoDocIdenità"
                    >
                    <MenuItem value="">
                        <em>Seleziona Documento Identità</em>
                    </MenuItem>
                    {tipologiche['Documento Identità']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <TextField
                  label="Documento Identità/Patente N°"
                  name="Documento Identità/Patente N°"
                  value={persona.docIdentità}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
                <TextField
                  label="Scadenza Doc Identità"
                  name="Scadenza Doc Identità"
                  value={persona.scadenzaDocIdentità}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
                <TextField
                  label="Rilascio Doc Identità"
                  name="Rilascio Doc Identità"
                  value={persona.rilascioDocIdentità}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
                <TextField
                  label="Ente Rilascio Doc Identità"
                  name="Ente Rilascio Doc Identità"
                  value={persona.enteRilascioDocIdentità}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              </Box>
              
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <TextField
                  label="Comune di Nascita"
                  name="Comune di Nascita"
                  value={persona.comuneNascita}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
                <TextField
                  label="Data di Nascita"
                  name="Data di Nascita"
                  value={persona.dataNascita}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Città di Residenza"
                  name="Città di Residenza"
                  value={persona.cittàResidenza}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Stato di Residenza"
                  name="Stato di Residenza"
                  value={persona.statoResidenza}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Indirizzo"
                  name="Indirizzo"
                  value={persona.indirizzo}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Civico"
                  name="Civico"
                  value={persona.civico}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Provincia"
                  name="Provincia"
                  value={persona.provincia}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
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
                  value={persona.telefono}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="Cellulare"
                  name="Cellulare"
                  value={persona.cellulare}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="eMail Ufficiale"
                  name="eMail Ufficiale"
                  value={persona.eMailUfficiale}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              <TextField
                  label="PEC"
                  name="PEC"
                  value={persona.pec}
                  onChange={(e) => handlePersonaFisicaChange(index, e)}
                  fullWidth
                />
              </Box> 
     
            <Button
                variant="outlined"
                color="error"
                onClick={() => rimuoviPersona(index)}
            >
                Rimuovi
            </Button>
            <Button variant="contained" onClick={aggiungiPersonaFisica}>
            Aggiungi Persona
            </Button>
        </Box>
        </AccordionDetails>
      </Accordion>
      ))}

    
    
    
    </>  );
}

export default PersonaFisica;