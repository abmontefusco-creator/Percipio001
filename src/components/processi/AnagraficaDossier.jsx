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

function AnagraficaDossier({row}) {
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
        <Tab label="Upload Cliente" />
        <Tab label="Upload Utility" />
        <Tab label="Doc. Cliente" />
        <Tab label="Doc. Utility" />
        <Tab label="Template Utility" />
      </Tabs>

      {/* Contenuti Tab */}
      <TabPanel value={tabIndex} index={0}>
        <Typography>Upload Cliente</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Typography>Upload Utility</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography>Doc. Cliente</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <Typography>Doc. Utility</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <Typography>Template Utility</Typography>
      </TabPanel>
    </Box>
  );
}

export default AnagraficaDossier;
