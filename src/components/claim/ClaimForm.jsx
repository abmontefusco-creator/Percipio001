import { useState, useEffect } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import PersonaFisica from './PersonaFisica';
import DettaglioReclamo from './DettaglioReclamo';
import PersonaGiuridica from './PersonaGiuridica';

function ClaimForm() {
  const [open, setOpen] = useState(false);

  const [tipologiche, setTipologiche] = useState({});
  const [form, setForm] = useState({
    clienteFinale: '',
    provenienzaClaim: '',
    settore: '',
    soggettoProvenienza: '',
    tipologiaClaim: '',
    argomento: '',
    subArgomento: '',
    oggettoClaim: '',
    sMCAnno: '',
    contrattoFornitura:'',
    reclamo:'',
    tipologiaContratto: '',
    tipologiaFornitura: '',
    personaFisica: [{ id: uuidv4(), 
                      ruoloPersonaFisica: '',
                      tipoDocIdenità: '', pec: '', nome: '' }],
    personaGiuridica: [{id: uuidv4(), 
                        ruoloPersonaGiuridica: '',
                        pec: '', nome: '' }],
  });

  // Carica le tipologiche all'inizio
  useEffect(() => {
    const fetchTipologiche = async () => {
      try {
        const response = await fetch('https://percipio001.onrender.com/api/tipologiche');
        const data = await response.json();
        console.log(data);
        // Trasforma in oggetto per accesso veloce
        // { "Cliente Finale": [...], "Provenienza Claim": [...] }
        const mapTipologiche = {};
        data.forEach((item) => {
          mapTipologiche[item.Tipologica] = item.descrizioni;
        });

        setTipologiche(mapTipologiche);
      } catch (error) {
        console.error('Errore caricamento tipologiche:', error);
      }
    };

    fetchTipologiche();
  }, []);

  // Aggiorna campi generici
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Aggiorna campi delle persone fisiche
  const handlePersonaChange = (index, e) => {
    const { name, value } = e.target;
    const persone = [...form.personaFisica];
    persone[index][name] = value;
    setForm({ ...form, personaFisica: persone });
  };



  // Aggiunge una nuova persona
  const aggiungiPersona = () => {
    setForm({
      ...form,
      personaFisica: [...form.personaFisica, {id: uuidv4(),  pec: '', nome: '' }]
    });
  };



  // Rimuove una persona
  const rimuoviPersona = (index) => {
    const persone = form.personaFisica.filter((_, i) => i !== index);
    setForm({ ...form, personaFisica: persone });
  };


  // Invia al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://percipio001.onrender.comcd server/Reclami', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      console.log('Documento inserito con ID:', data.insertedId);
      
    } catch (error) {
      console.error('Errore inserimento documento:', error);
    }
  };

  return (
   <form onSubmit={handleSubmit}>
      {/* Accordion 1: Dati principali */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Dati principali</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Cliente Finale</InputLabel>
                    <Select
                    name="clienteFinale"
                    value={form.clienteFinale}
                    onChange={handleChange}
                    label="Cliente Finale"
                    >
                    <MenuItem value="">
                        <em>Seleziona Cliente</em>
                    </MenuItem>
                    {tipologiche['Cliente Finale']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Provenienza Claim</InputLabel>
                    <Select
                    name="provenienzaClaim"
                    value={form.provenienzaClaim}
                    onChange={handleChange}
                    label="Provenienza Claim"
                    >
                    <MenuItem value="">
                        <em>Seleziona Provenienza Claim</em>
                    </MenuItem>
                    {tipologiche['Provenienza Claim']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Settore</InputLabel>
                    <Select
                    name="settore"
                    value={form.settore}
                    onChange={handleChange}
                    label="Settore"
                    >
                    <MenuItem value="">
                        <em>Seleziona Settore</em>
                    </MenuItem>
                    {tipologiche['Settore']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Box>


            <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Soggetto Provenienza</InputLabel>
                    <Select
                    name="soggettoProvenienza"
                    value={form.soggettoProvenienza}
                    onChange={handleChange}
                    label="Cliente Finale"
                    >
                    <MenuItem value="">
                        <em>Soggetto Provenienza</em>
                    </MenuItem>
                    {tipologiche['Soggetto Provenienza']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Tipologia Claim</InputLabel>
                    <Select
                    name="tipologiaClaim"
                    value={form.tipologiaClaim}
                    onChange={handleChange}
                    label="Provenienza Claim"
                    >
                    <MenuItem value="">
                        <em>Seleziona Tipologia Claim</em>
                    </MenuItem>
                    {tipologiche['Tipologia Claim']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Argomento</InputLabel>
                    <Select
                    name="argomento"
                    value={form.argomento}
                    onChange={handleChange}
                    label="argomento"
                    >
                    <MenuItem value="">
                        <em>Seleziona Argomento</em>
                    </MenuItem>
                    {tipologiche['Argomento']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Sub Argomento</InputLabel>
                    <Select
                    name="subArgomento"
                    value={form.subArgomento}
                    onChange={handleChange}
                    label="Sub Argomento"
                    >
                    <MenuItem value="">
                        <em>Seleziona Sub Argomento</em>
                    </MenuItem>
                    {tipologiche['Sub Argomento']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Oggetto Claim</InputLabel>
                    <Select
                    name="oggettoClaim"
                    value={form.oggettoClaim}
                    onChange={handleChange}
                    label="oggettoClaim"
                    >
                    <MenuItem value="">
                        <em>Seleziona Oggetto Claim</em>
                    </MenuItem>
                    {tipologiche['Oggetto Claim']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Box>
        </AccordionDetails>
    </Accordion>

      <PersonaFisica
        form={form}
        setForm={setForm}      
        tipologiche={tipologiche}
        handleChange={handleChange}
      />   

      <PersonaGiuridica
        form={form}
        setForm={setForm}      
        tipologiche={tipologiche}
        handleChange={handleChange}
      />   

      <DettaglioReclamo
        form={form}
        setForm={setForm}      
        tipologiche={tipologiche}
        handleChange={handleChange}
      />   
      


      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          Invia
        </Button>
      </Box>
    </form>
  );
}

export default ClaimForm;
