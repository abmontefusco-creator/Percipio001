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
const API_URL = import.meta.env.VITE_API_URL;

function ClaimForm({ row, setSelectedRow }) {

  const [open, setOpen] = useState(false);
  const [tipologiche, setTipologiche] = useState({});
  const [loading, setLoading] = useState(false);

  const numReclamoCorrente = row?.NumReclamo;

  const aggiungiPersonaFisica = async () => {
    const nuovaPersona = {
      _id: crypto.randomUUID(),
      codFiscale: ""
    };

    // Aggiorno subito la UI
    setSelectedRow(prev => ({
      ...prev,
      personaFisica: [
        ...(prev.personaFisica ?? []),
        nuovaPersona
      ]
    }));

    // poi eventualmente salviamo su Mongo
  };

  const aggiungiPersonaGiuridica = async () => {
    const nuovaPersona = {
      _id: crypto.randomUUID(),
      codFiscale: ""
    };

    // Aggiorno subito la UI
    setSelectedRow(prev => ({
      ...prev,
      personaFisica: [
        ...(prev.personaFisica ?? []),
        nuovaPersona
      ]
    }));

    // poi eventualmente salviamo su Mongo
  };

useEffect(() => {
  if (!numReclamoCorrente) {
    console.log("⛔ Nessun NumReclamo: fetch NON eseguita");
    return;
  }

  const loadData = async () => {
    try {
      setLoading(true);

      const url =
        `${API_URL}/reclami/reclamoCompleto/${numReclamoCorrente}`;

      console.log("🌐 CHIAMATA:", url);

      const response = await fetch(url);

      console.log("📡 RESPONSE STATUS:", response.status);

      if (!response.ok) {
        throw new Error(`Errore HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log(
        "📦 RECLAMO COMPLETO:",
        JSON.stringify(data, null, 2)
      );

      console.log("✅ AGGIORNO selectedRow");
      setSelectedRow(data);

    } catch (error) {
      console.error(
        "❌ Errore caricamento reclamo:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadData();

}, [numReclamoCorrente]);

  console.log(
    "🔄 ClaimForm render -",
    row?.NumReclamo,
    row?.clienteFinale
  );

//  console.log(    "data:",    JSON.stringify(row, null, 2));

  const [form, setForm] = useState({
    _id: null,
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
                      codiceFiscale: '',
                      nome: '',
                      cognome: '',
                      ruoloPersonaFisica: '',
                      tipoDocIdenità: '', pec: '' }],
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
const handleChange = async (e) => {
  const { name, value } = e.target;
  
  setSelectedRow(prev => {
    const nuovoRow = {
      ...prev,
      [name]: value
    };

    console.log("NUOVO selectedRow:", nuovoRow);
  console.log("🟣 ClaimForm: ARRIVATO AL RETURN");
    return nuovoRow;
  });

  try {
    const response = await fetch(
      `${API_URL}/api/reclami/${row.NumReclamo}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          field: name,
          value: value
        })
      }
    );

    if (!response.ok) {
      throw new Error("Errore nel salvataggio");
    }

    console.log("SALVATO DB:", name, value);

  } catch (error) {
    console.error("Errore autosave:", error);
  }
};
  // Aggiorna campi delle persone fisiche
  /*const handlePersonaChange = (index, e) => {
    const { name, value } = e.target;
    const persone = [...row.personaFisica];
    persone[index][name] = value;
    setForm({ ...row, personaFisica: persone });
  };*/
  

  // Rimuove una persona
  const rimuoviPersona = (index) => {
    const persone = form.personaFisica.filter((_, i) => i !== index);
    setForm({ ...form, personaFisica: persone });
  };


  // Invia al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isUpdate = !!form._id;
      const url = isUpdate
        ? `https://percipio001.onrender.com/Reclami/${form._id}`
        : 'https://percipio001.onrender.com/Reclami';

      const method = isUpdate ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (isUpdate) {
          console.log('Documento aggiornato:', data);
        } else {
          console.log('Documento inserito con ID:', data.insertedId);
        }

      } catch (error) {
        console.error('Errore salvataggio documento:', error);
      }
    } finally {
    setLoading(false);
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
                    value={row?.clienteFinale ?? ""}
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
                    value={row?.provenienzaClaim ?? ""}
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
                    value={row?.settore ?? ""}
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
                    value={row?.soggettoProvenienza ?? ""}
                    onChange={handleChange}
                    label="Soggetto Provenienza"
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
                    value={row?.tipologiaClaim ?? ""}
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
                    value={row?.argomento ?? ""}
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
                    value={row?.subArgomento ?? ""}
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
                    value={row?.oggettoClaim ?? ""}
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
      <Button
        variant="contained"
        onClick={aggiungiPersonaFisica}
        sx={{ mb: 2 }}
      >
        Aggiungi persona
      </Button>
      {row?.personaFisica?.map((persona, index) => (
        <PersonaFisica
          key={persona.id}
          persona={persona}
          numReclamo={row.NumReclamo}
          setRow={setSelectedRow}
          tipologiche={tipologiche}
        />
        ))}
      <Button
        variant="contained"
        onClick={aggiungiPersonaGiuridica}
        sx={{ mb: 2 }}
      >
        Aggiungi Azienda
      </Button>
      {row?.personaGiuridica?.map((persona, index) => (
        <PersonaGiuridica
          key={persona.id}
          persona={persona}
          numReclamo={row.NumReclamo}
          setRow={setSelectedRow}
          tipologiche={tipologiche}
        />
        ))}

      <DettaglioReclamo
        row={row}
        setSelectedRow={setSelectedRow}      
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
