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

function MappaControlli({row}) {
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
        <Tab label="Controllo Tempo" />
        <Tab label="Controllo Info" />
        <Tab label="Controllo Calcolo" />
        <Tab label="Report Conformità" />
      </Tabs>

      {/* Contenuti Tab */}
      <TabPanel value={tabIndex} index={0}>
        <Typography>Controllo Tempo</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Typography>Controllo Info</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography>Controllo Calcolo</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <Typography>Report Conformità</Typography>
      </TabPanel>
    </Box>
  );
}

export default MappaControlli;
