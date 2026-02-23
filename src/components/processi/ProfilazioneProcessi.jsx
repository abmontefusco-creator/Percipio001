import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography
} from "@mui/material";
import ProfilazioneARERA from "./Profilazione Dossier/ProfilazioneARERA";
import ProfilazioneRischi from "./Profilazione Dossier/ProfilazioneRischi";
import ProfilazioneLettere from "./Profilazione Dossier/ProfilazioneLettere";

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
  const numReclamoPar = 1055;

  const handleChange = (_, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>

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
        <Tab label="Profilazione ARERA" />
        <Tab label="Configurazione Lettere" />
        <Tab label="Profilazione Template" />
        <Tab label="Profilazione Rischi" />
        <Tab label="Check Profilazione" />
      </Tabs>

      {/* Contenuti Tab */}
      <TabPanel value={tabIndex} index={0}>
        <ProfilazioneARERA numReclamo={numReclamoPar}/>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <ProfilazioneLettere  numReclamo={numReclamoPar}/>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography>Contenuto Profilazione Template</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <ProfilazioneRischi rows={row}/>
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <Typography>Check Profilazione</Typography>
      </TabPanel>
    </Box>
  );
}

export default ProfilazioneDossier;
