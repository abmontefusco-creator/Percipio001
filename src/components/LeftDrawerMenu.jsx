import * as React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import ContactsIcon from "@mui/icons-material/Contacts";

const drawerWidth = 240;



export default function LeftDrawerMenu({ open, onClose, onNavigate }) {
  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate("ricerca")}>
            <ListItemText primary="Ricerca Claim" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate("claimForm")}>
            <ListItemText primary="Inserimento Claim" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => onNavigate("contatti")}>
            <ListItemText primary="Contatti" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
