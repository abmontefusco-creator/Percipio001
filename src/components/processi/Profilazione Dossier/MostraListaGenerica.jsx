import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress
} from "@mui/material";

import useReclamoAutoSave from "../../../hooks/useReclamoAutoSave";
import AutoSaveCheckbox from "../../pageComponents/AutoSaveCheckbox";

const API_URL = import.meta.env.VITE_API_URL;

const MostraLista = ({ numReclamo, nomeArray, nomeQuery }) => {

  /*
   * ============================================================
   * AUTOSAVE
   * ============================================================
   */
  const {
    isSaving,
    isSaved,
    errors
  } = useReclamoAutoSave(numReclamo);

  /*
   * ============================================================
   * STATE
   * ============================================================
   */
  const [listaCompleta, setListaCompleta] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
   * ============================================================
   * CARICAMENTO DATI
   * ============================================================
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const url = `${API_URL}/${nomeQuery}/${numReclamo}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            "Errore nel caricamento dei dati Liste"
          );
        }
        const data = await response.json();
        const lista = data.listaRitorno || [];
        console.log('data ' + lista);
        
        setListaCompleta(lista);

      } catch (error) {

        console.error(
          "Errore caricamento Liste:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    if (numReclamo) {
      loadData();
    }

  }, [numReclamo, nomeQuery]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */
  if (loading) {
    return <CircularProgress />;
  }

  /*
   * ============================================================
   * NESSUN DATO
   * ============================================================
   */
  if (listaCompleta.length === 0) {
    return <div>Nessun dato disponibile</div>;
  }

  /*
   * ============================================================
   * DETERMINAZIONE COLONNE
   *
   * Prendiamo tutte le proprietà presenti negli oggetti.
   * ============================================================
   */
  const colonne = [
    ...new Set(
      listaCompleta.flatMap((item) =>
        Object.keys(item)
      )
    )
  ];

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 500,
        overflow: "auto"
      }}
    >
      <Table stickyHeader>
      
      <TableHead>
            <TableRow>

              {colonne.map((colonna) => (

                <TableCell
                  key={colonna}
                  align={colonna === "presente" ? "center" : "left"}
                  sx={{
                    backgroundColor: "#d9eaf7",
                    fontWeight: "bold",
                    color: "#1f1f1f",
                    position: "sticky",
                    top: 0,
                    zIndex: 2
                  }}
                >
                  {colonna}
                </TableCell>

              ))}

              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#d9eaf7",
                  fontWeight: "bold",
                  color: "#1f1f1f",
                  position: "sticky",
                  top: 0,
                  zIndex: 2
                }}
              >
                Stato
              </TableCell>

            </TableRow>
          </TableHead>

        <TableBody>

          {listaCompleta.map((item, index) => {

            const savingRow = isSaving({
              array: nomeArray,
              rowKey: item.nome,
              field: "presente"
            });

            const savedRow = isSaved({
              array: nomeArray,
              rowKey: item.nome,
              field: "presente"
            });

            const errorRow =
              errors[
                `lista.${item.nome}.presente`
              ];

            return (

              <TableRow
                key={item.nome ?? index}
              >

                {colonne.map((colonna) => {

                  /*
                   * ==================================================
                   * CHECKBOX PRESENTE
                   * ==================================================
                   */
                  if (colonna === "presente") {

                    return (
                      <TableCell
                        key={colonna}
                        align="center"
                      >

                        <AutoSaveCheckbox
                          numReclamo={numReclamo}
                          initialChecked={
                            Number(item.presente) === 1
                          }
                          array={nomeArray}
                          rowKeyField="nome"
                          rowKey={item.nome}
                          field="presente"
                          rowData={item}
                        />

                      </TableCell>
                    );
                  }

                  /*
                   * ==================================================
                   * VALORE NORMALE
                   * ==================================================
                   */
                  return (
                    <TableCell key={colonna}>
                      {item[colonna] !== null &&
                      item[colonna] !== undefined
                        ? String(item[colonna])
                        : ""}
                    </TableCell>
                  );

                })}

                <TableCell align="center">

                  {savingRow && "Salvataggio..."}

                  {savedRow &&
                    !savingRow &&
                    "Salvato"}

                  {errorRow &&
                    !savingRow &&
                    "Errore"}

                </TableCell>

              </TableRow>

            );
          })}

        </TableBody>

      </Table>
    </TableContainer>
  );
};

export default MostraLista;