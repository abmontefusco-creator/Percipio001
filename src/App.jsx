import React, { useState, useEffect } from 'react';
import ClaimForm from "./components/claim/ClaimForm";
import RicercaPage from "./components/RicercaPage";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import LeftDrawerMenu from "./components/LeftDrawerMenu";

function InserimentoClaim() { 
  return <div>Inserimento Claim</div>; 
} 
function RicercaClaim() {
  return <div>Ricerca Claim</div>; 
} 
function Contatti() { 
  return <div>Contatti</div>; 
}

export default function App() {
  const [activePage, setActivePage] = React.useState("claim");
  const [open, setOpen] = React.useState(false);
  
  const handleNavigate = (path) => {
    setActivePage(path);
    setOpen(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case "ricerca":
        return <RicercaPage />;
      case "contatti":
        return <ContattiPage />;
      default:
        return <ClaimForm />;
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Gestione Claim</Typography>
        </Toolbar>
      </AppBar>

      <LeftDrawerMenu
        open={open}
        onClose={() => setOpen(false)}
        onNavigate={handleNavigate}
      />
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-800">
               {renderPage()}
            </div>
          </main>
        </div>
            </>
  );
}
