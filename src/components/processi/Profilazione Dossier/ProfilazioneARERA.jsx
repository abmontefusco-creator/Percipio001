import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Checkbox
} from "@mui/material";

const ProfilazioneARERA = ({numReclamo}) => {
  const [areraCompleta, setAreraCompleta] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});

  // fetch dati dal backend
  useEffect(() => {
     if (!numReclamo) return; // evita chiamate inutili
     fetch(`https://percipio001.onrender.com/reclamiArera/${numReclamo}`)
      .then(res => res.json())
      .then(data => {
        // supponendo che il JSON sia { areraCompleta: [...] }
        console.log(data);
        setAreraCompleta(data.areraCompleta || []);
      })
      .catch(err => console.error(err));
  }, []);

  // toggle checkbox
  const handleCheck = (index) => {
    setCheckedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600, margin: "20px auto", boxShadow: 1 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Seleziona</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {areraCompleta.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.nome}</TableCell>
              <TableCell>
                <Checkbox
                  checked={Number(item.presente) === 1}
                  onChange={() => handleCheck(index)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProfilazioneARERA;
