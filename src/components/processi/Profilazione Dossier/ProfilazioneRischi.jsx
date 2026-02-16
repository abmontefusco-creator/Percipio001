import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from "@mui/material";


const ProfilazioneRischi = ({ rows, reclamiAreraNomi }) => {

  if (!rows || rows.length === 0) {
    return <div>Nessun dato disponibile</div>;
  }

  // 🔹 filtro per nome presente nell'array
  const filteredRows = rows.filter(row =>
    reclamiAreraNomi.includes(row.nome)
  );

  if (filteredRows.length === 0) {
    return <div>Nessun documento selezionato</div>;
  }

  const headers = Object.keys(filteredRows[0]);

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
