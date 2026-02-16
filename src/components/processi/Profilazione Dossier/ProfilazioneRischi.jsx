import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from "@mui/material";

const ProfilazioneRischi = ({ numReclamo }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!numReclamo) return;

    fetch(`http://localhost:5000/reclamiArera/${numReclamo}`)
      .then(res => res.json())
      .then(data => {
        const lista = data.arera || data.areraCompleta || [];
        setRows(lista);
      })
      .catch(err => console.error(err));

  }, [numReclamo]);

  // Se non ci sono dati
  if (!rows || rows.length === 0) {
    return <div>Nessun dato disponibile</div>;
  }

  // 🔹 Prendo le chiavi dal primo oggetto
  const headers = Object.keys(rows[0]);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "90%", margin: "20px auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((key) => (
              <TableCell key={key} sx={{ fontWeight: "bold" }}>
                {key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredRows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((key) => (
                <TableCell key={key}>
                  {typeof row[key] === "object"
                    ? JSON.stringify(row[key])
                    : row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProfilazioneRischi;
