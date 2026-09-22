import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography
} from "@mui/material";
import MostraLista from "./Profilazione Dossier/MostraListaGenerica";


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

function ProfilazioneDossier({row}) {
  const [tabIndex, setTabIndex] = useState(0);
  const numReclamoPar = row.NumReclamo;

  const handleChange = (_, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Tab Strip */}
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Profilazione ARERA" />
        <Tab label="Configurazione Lettere" />
        <Tab label="Profilazione Template" />
        <Tab label="Profilazione Rischi" />
        <Tab label="Check Profilazione" />
      </Tabs>

      {/* Contenuti Tab */}
      <TabPanel value={tabIndex} index={0}>
        <MostraLista
          numReclamo={numReclamoPar}
          nomeArray="profilazioneARERA"
          nomeQuery="reclamiArera"
        />
        
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <MostraLista
          numReclamo={numReclamoPar}
          nomeArray="profilazioneLettere"
          nomeQuery="reclamiLettere"
        />
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography>Contenuto Profilazione Template</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <MostraLista
          numReclamo={numReclamoPar}
          nomeArray="profilazioneRischi"
          nomeQuery="reclamiRischi"
        />
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <MostraLista
          numReclamo={numReclamoPar}
          nomeArray="profilazioneRischi"
          nomeQuery="reclamiCheckRischi"
        />
      </TabPanel>
    </Box>
  );
}

export default ProfilazioneDossier;
