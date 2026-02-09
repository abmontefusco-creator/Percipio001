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

function DettaglioReclamo({ form, setForm, tipologiche, handleChange }) {

  return (
    <>
          {/* Accordion : Dettaglio Reclamo*/}
    
            
      <Accordion >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Dettaglio Reclamo</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Tipologia Contratto</InputLabel>
                    <Select
                    name="tipologiaContratto"
                    value={form.tipologiaContratto}
                    onChange={handleChange}
                    label="Tipologia Contratto"
                    >
                    <MenuItem value="">
                        <em>Seleziona Tipologia Contratto</em>
                    </MenuItem>
                    {tipologiche['Tipologia Contratto']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Tipologia Fornitura</InputLabel>
                    <Select
                    name="tipologiaFornitura"
                    value={form.tipologiaFornitura}
                    onChange={handleChange}
                    label="Tipologia Fornitura"
                    >
                    <MenuItem value="">
                        <em>Seleziona Tipologia Fornitura</em>
                    </MenuItem>
                    {tipologiche['Tipologia Fornitura E.E.']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>Potenza KW</InputLabel>
                    <Select
                    name="tipologiaFornitura"
                    value={form.potenzaKW}
                    onChange={handleChange}
                    label="Potenza KW"
                    >
                    <MenuItem value="">
                        <em>Seleziona Potenza KW</em>
                    </MenuItem>
                    {tipologiche['Potenza KW']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>SMC Anno</InputLabel>
                    <Select
                    name="sMCAnno"
                    value={form.sMCAnno}
                    onChange={handleChange}
                    label="SMC Anno"
                    >
                    <MenuItem value="">
                        <em>Seleziona SMC Anno</em>
                    </MenuItem>
                    {tipologiche['SMC/Anno']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <TextField
                  label="codice POD"
                  name="codicePOD"
                  value={form.codicePOD}
                  onChange={(e) => handleChange(index, e)}
                  fullWidth
                />
                <TextField
                  label="Codice PdR"
                  name="codicePdR"
                  value={form.codicePdR}
                  onChange={(e) => handleChange(index, e)}
                  fullWidth
                />
                <TextField
                  label="Riferimento Reclamo"
                  name="riferimentoReclamo"
                  value={form.riferimentoReclamo}
                  onChange={(e) => handleChange(index, e)}
                  fullWidth
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                    <InputLabel>Contratto Fornitura</InputLabel>
                    <Select
                    name="contrattoFornitura"
                    value={form.contrattoFornitura}
                    onChange={handleChange}
                    label="Contratto Fornitura"
                    >
                    <MenuItem value="">
                        <em>Seleziona Contratto Fornitura</em>
                    </MenuItem>
                    {tipologiche['Contratto Fornitura']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <TextField
                  label="Numero Contratto"
                  name="numeroContratto"
                  value={form.numeroContratto}
                  onChange={(e) => handleChange(index, e)}
                  fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel>Reclamo</InputLabel>
                    <Select
                    name="reclamo"
                    value={form.reclamo}
                    onChange={handleChange}
                    label="Reclamo"
                    >
                    <MenuItem value="">
                        <em>Seleziona Reclamo</em>
                    </MenuItem>
                    {tipologiche['Reclamo']?.map((valore) => (
                        <MenuItem key={valore.descrizione} value={valore.descrizione}>
                        {valore.descrizione}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                
              </Box>
        </Box>
        </AccordionDetails>
      </Accordion>

    
    
    
    </>  );
}

export default DettaglioReclamo;