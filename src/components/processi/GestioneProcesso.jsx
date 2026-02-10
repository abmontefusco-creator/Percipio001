import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography
} from "@mui/material";
import ProfilazioneDossier from "./ProfilazioneProcessi";
import AnagraficaDossier from "./AnagraficaDossier";
import MappaControlli from "./MappaControlli";

// Helper TabPanel (pattern MUI standard)
function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function GestioneProcesso({row}) {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Intestazione */}
      <Typography variant="h4" gutterBottom>
        Gestione Processo
      </Typography>

      {row && (
        <Typography variant="subtitle1" gutterBottom>
          Claim selezionato: {row.name}
        </Typography>
      )}

      {/* Tab Strip */}
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Profilazione Dossier" />
        <Tab label="Anagrafica Dossier" />
        <Tab label="Template Finiti" />
        <Tab label="Mappa Controlli" />
        <Tab label="Autorizzazione Risposta" />
        <Tab label="Modifica Claim" />
      </Tabs>

      {/* Contenuti Tab */}
      <TabPanel value={tabIndex} index={0}>
        <ProfilazioneDossier row={row}/>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <AnagraficaDossier  row={row}/>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography>Contenuto Template Finiti</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <MappaControlli row={row}/>
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <Typography>Contenuto Autorizzazione Risposta</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={5}>
        <Typography>Contenuto Modifica Claim</Typography>
      </TabPanel>
    </Box>
  );
}
