import { useRef, useState } from "react";
import { Spreadsheet, Worksheet } from "@jspreadsheet/react";
import * as XLSX from "xlsx";

import "jspreadsheet/dist/jspreadsheet.css";
import "jsuites/dist/jsuites.css";

export default function ExcelTest() {
  const spreadsheet = useRef(null);

  const [worksheets, setWorksheets] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);

        const workbook = XLSX.read(data, {
          type: "array",
          cellDates: true,
        });

        const sheets = workbook.SheetNames.map((sheetName) => {
          const sheet = workbook.Sheets[sheetName];

          const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

          const rows = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
            raw: false,
          });

          const columnCount = range.e.c + 1;
          const rowCount = range.e.r + 1;

          const columns = [];

          for (let col = 0; col < columnCount; col++) {
            const columnLetter = XLSX.utils.encode_col(col);

            let width = 120;

            if (sheet["!cols"]?.[col]?.wch) {
              width = Math.max(60, sheet["!cols"][col].wch * 8);
            }

            columns.push({
              type: "text",
              title: columnLetter,
              width,
            });
          }

          return {
            name: sheetName,
            data: rows,
            columns,
            minDimensions: [
              Math.max(columnCount, 10),
              Math.max(rowCount, 20),
            ],
          };
        });

        setWorksheets(sheets);
      } catch (error) {
        console.error("Errore nella lettura del file Excel:", error);
        alert("Impossibile leggere il file Excel.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      style={{
        padding: "80px 20px 20px 20px",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2>Importazione Excel</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
        />
      </div>

      {fileName && (
        <div style={{ marginBottom: 15 }}>
          <strong>File:</strong> {fileName}
        </div>
      )}

      {worksheets.length > 0 && (
        <Spreadsheet ref={spreadsheet}>
          {worksheets.map((sheet) => (
            <Worksheet
              key={sheet.name}
              worksheetName={sheet.name}
              data={sheet.data}
              columns={sheet.columns}
              minDimensions={sheet.minDimensions}
            />
          ))}
        </Spreadsheet>
      )}
    </div>
  );
}