import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography
} from "@mui/material";

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
        <Typography>Contenuto Profilazione ARERA</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Typography>Contenuto Configurazione Lettere</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography>Contenuto Profilazione Template</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <Typography>Contenuto Profilazione Rischi</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <Typography>Check Profilazione</Typography>
      </TabPanel>
    </Box>
  );
}

export default ProfilazioneDossier;
