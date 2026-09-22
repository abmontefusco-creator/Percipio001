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
import AutoSaveFileUpload from "../../pageComponents/AutoSaveFileUpload";

const API_URL = import.meta.env.VITE_API_URL;

const MostraLista = ({ numReclamo, nomeArray, nomeQuery }) => {

  const {
      updateField,
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
        const url = `${API_URL}/reclami/${nomeQuery}/${numReclamo}`;
        console.log('url ' + url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            "Errore nel caricamento dei dati Liste"
          );
        }
        const data = await response.json();
        //console.log("data:", JSON.stringify(data, null, 2));
        const lista = data.listaRitorno || [];
        
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

        {colonne.map((colonna) => {

          if (colonna === "_id") {
            return null;
          }

          return (
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
              {colonna}
            </TableCell>
          );

        })}

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
          const rowKey = Object.entries(item)
            .filter(([key]) => key !== "presente")
            .map(([key, value]) => `${key}=${value}`)
            .join("|");


          const savingRow = isSaving({
            array: nomeArray,
            rowData: item,
            field: "presente"
          });


          const savedRow = isSaved({
            array: nomeArray,
            rowData: item,
            field: "presente"
          });


          const errorRow =
            errors[
              `${nomeArray}.${rowKey}.presente`
            ];


          return (
            <TableRow key={rowKey || index}>

              {colonne.map((colonna) => {

                if (colonna === "_id") {
                  return null;
                }


                if (colonna.startsWith("upload")) {

                  return (
                    <TableCell key={colonna}>

                      <AutoSaveFileUpload
                        numReclamo={item.NumReclamo}
                        rowId={item._id}
                      />

                    </TableCell>
                  );
                }


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
                        field="presente"
                        rowData={item}
                        updateField={updateField}
                        isSaving={isSaving}
                        isSaved={isSaved}
                        errors={errors}
                      />

                    </TableCell>
                  );
                }


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

    </Table>    </TableContainer>
  );
};

export default MostraLista;