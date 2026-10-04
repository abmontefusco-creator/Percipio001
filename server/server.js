import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Reclami from "./models/reclamiModel.js";
import Tipologiche from "./models/tipologicheModel.js";
import { ObjectId } from "mongodb";
import File from "./models/fileModel.js";
import {getViewModel} from "./models/createViewModel.js";
import DocumentoConfigurazione from "./models/documentoConfigurazioneModel.js";
import { inviaMail } from "./services/emailService.js";

console.log("✅ SERVER JS IN ESECUZIONE DA:", process.cwd());

const app = express();
app.use(cors());
app.use(express.json());

// Connessione a MongoDB
mongoose.connect("mongodb+srv://ue_amontefusco:AQUILOTTO@clusterm2.5cykqpk.mongodb.net/Percipio?retryWrites=true&w=majority")
  .then(() => console.log("✅ Connessione a MongoDB riuscita"))
  .catch(err => console.error("❌ Errore connessione MongoDB:", err.message));


//console.log('Checkpoint'); // per vedere se il server arriva lì
debugger;

app.post("/api/mail/invia", async (req, res) => {
    try {
        const {
            to,
            cc,
            subject,
            text,
            html
        } = req.body;

        if (!to) {
            return res.status(400).json({
                error: "Destinatario obbligatorio"
            });
        }

        if (!subject) {
            return res.status(400).json({
                error: "Oggetto obbligatorio"
            });
        }

        const risultato = await inviaMail({
            to,
            cc,
            subject,
            text,
            html
        });

        res.json({
            ok: true,
            messageId: risultato.messageId
        });

    } catch (error) {
        console.error("ERRORE INVIO MAIL:", error);

        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

app.delete(
  "/api/documenti-configurazione/:id",
  async (req, res) => {

    try {

      const { id } = req.params;

      console.log(
        "DELETE DOCUMENTO CONFIGURAZIONE:",
        id
      );

      // Verifica che l'ID sia valido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          ok: false,
          error: "ID documento non valido"
        });
      }

      const documento =
        await DocumentoConfigurazione.findById(id);

      if (!documento) {

        return res.status(404).json({
          ok: false,
          error: "Documento non trovato"
        });

      }

      /*
       * Per ora eliminiamo il documento Mongo.
       *
       * Successivamente aggiungeremo anche
       * l'eliminazione del file da Supabase.
       */

      await DocumentoConfigurazione.deleteOne({
        _id: documento._id
      });

      console.log(
        "DOCUMENTO ELIMINATO:",
        documento.nomeFile
      );

      return res.json({
        ok: true,
        deletedId: id,
        nomeFile: documento.nomeFile
      });

    } catch (error) {

      console.error(
        "ERRORE DELETE DOCUMENTO CONFIGURAZIONE:",
        error
      );

      return res.status(500).json({
        ok: false,
        error: error.message
      });
    }
  }
);

app.post("/api/documenti-configurazione",async (req, res) => {
    try {
      console.log(
        "===== POST DOCUMENTO CONFIGURAZIONE ====="
      );

      console.log("BODY:",
        JSON.stringify(req.body, null, 2)
      );


      const {
        nomeFile,
        tipoDocumento,
        reclamo,
        valido,
        path,
        fullPath,
        versione
      } = req.body;


      /*
       * =====================================================
       * VALIDAZIONE
       * =====================================================
       */

      if (!nomeFile) {
        return res.status(400).json({
          ok: false,
          error: "nomeFile obbligatorio"
        });
      }


      if (!tipoDocumento) {
        return res.status(400).json({
          ok: false,
          error: "tipoDocumento obbligatorio"
        });
      }


      const tipiValidi = [
        "TIPOLOGIE",
        "ARERA",
        "LETTERE",
        "TEMPLATE_FINITE"
      ];


      if (!tipiValidi.includes(tipoDocumento)) {
        return res.status(400).json({
          ok: false,
          error:
            `Tipo documento non valido: ${tipoDocumento}`
        });
      }


      /*
       * =====================================================
       * CREA DOCUMENTO
       * =====================================================
       */

      const nuovoDocumento =
        new DocumentoConfigurazione({

          nomeFile,

          tipoDocumento,

          reclamo:
            reclamo !== undefined
              ? Number(reclamo)
              : 0,

          valido:
            valido === true,

          path,

          fullPath,

          versione:
            versione !== undefined
              ? Number(versione)
              : 1

        });


      const documento =
        await nuovoDocumento.save();


      console.log(
        "DOCUMENTO CONFIGURAZIONE SALVATO:",
        documento
      );


      res.status(201).json({

        ok: true,

        documento

      });


    } catch (error) {

      console.error(
        "ERRORE POST DOCUMENTO CONFIGURAZIONE:",
        error
      );


      res.status(500).json({

        ok: false,

        error: error.message

      });

    }

  }
);

app.get("/api/documenti-configurazione", async (req, res) => {
  try {
    const {
      reclamo,
      tipoDocumento
    } = req.query;

    const filtro = {};

    if (reclamo !== undefined) {
      filtro.reclamo = Number(reclamo);
    }

    if (tipoDocumento) {
      filtro.tipoDocumento = tipoDocumento;
    }

    console.log(
      "GET DOCUMENTI CONFIGURAZIONE:",
      filtro
    );

    const documenti =
      await DocumentoConfigurazione
        .find(filtro)
        .sort({
          createdAt: -1
        })
        .lean();

    res.json(documenti);

  } catch (error) {

    console.error(
      "ERRORE RECUPERO DOCUMENTI CONFIGURAZIONE:",
      error
    );

    res.status(500).json({
      error: error.message
    });
  }
});
    
app.patch("/api/reclami/:NumReclamo", async (req, res) => {

    try {

        const { NumReclamo } = req.params;

        const {
            field,
            value,
            array,
            rowData,
            rowId
        } = req.body;


        /*
         * =====================================================
         * LOG GENERALE
         * =====================================================
         */

        console.log("===== PATCH RECLAMO =====");

        console.log("NumReclamo:", NumReclamo);
        console.log("array:", array);
        console.log("field:", field);
        console.log("value:", value);
        console.log("rowId:", rowId);
        console.log(
            "rowData:",
            JSON.stringify(rowData, null, 2)
        );


        /*
         * =====================================================
         * VALIDAZIONE BASE
         * =====================================================
         */

        if (!field) {

            return res.status(400).json({
                ok: false,
                error: "Specificare field"
            });

        }

        if (array && rowId) {

            console.log("🔥 RAMO ROW ID");
            console.log("rowId:", rowId);
            console.log("tipo rowId:", typeof rowId);

            const objectId = new mongoose.Types.ObjectId(rowId);

            console.log("objectId:", objectId);
            console.log("tipo objectId:", typeof objectId);

            const result = await Reclami.updateOne(
                {
                    NumReclamo: Number(NumReclamo),
                    [`${array}._id`]: objectId
                },
                {
                    $set: {
                        [`${array}.$.${field}`]: value
                    }
                }
            );

            console.log("RISULTATO UPDATE BY ID:", result);

            if (result.matchedCount === 0) {
                return res.status(404).json({
                    ok: false,
                    error: `Elemento ${rowId} non trovato nell'array ${array}`
                });
            }

            return res.json({
                ok: true,
                operation: "update-array-element-by-id",
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                array,
                rowId,
                field
            });
        }

        /*
         * =====================================================
         * CASO 1
         *
         * CAMPO DIRETTO DEL DOCUMENTO
         *
         * Esempio:
         *
         * {
         *   field: "stato",
         *   value: "APERTO"
         * }
         * =====================================================
         */

        if (!array) {

            const result = await Reclami.updateOne(
                {
                    NumReclamo: Number(NumReclamo)
                },
                {
                    $set: {
                        [field]: value
                    }
                }
            );


            if (result.matchedCount === 0) {

                return res.status(404).json({
                    ok: false,
                    error: `Reclamo ${NumReclamo} non trovato`
                });

            }


            return res.json({

                ok: true,

                operation: "update-field",

                matchedCount: result.matchedCount,

                modifiedCount: result.modifiedCount

            });

        }


        /*
         * =====================================================
         * CASO NUOVO
         *
         * ARRAY + rowId
         *
         * Usiamo direttamente _id del subdocumento.
         *
         * Esempio:
         *
         * array: "profilazioneRischi"
         * rowId: "..."
         * field: "upload"
         * =====================================================
         */

        if (rowId) {

            console.log(
                "UPDATE ARRAY CON ROW ID"
            );

            console.log(
                "array:",
                array
            );

            console.log(
                "rowId:",
                rowId
            );

            console.log(
                "field:",
                field
            );


            const result = await Reclami.updateOne(

                {
                    NumReclamo: Number(NumReclamo),
                    [`${array}._id`]: rowId
                },

                {
                    $set: {
                        [`${array}.$.${field}`]: value
                    }
                }

            );


            console.log(
                "RISULTATO UPDATE ROW ID:",
                {
                    matchedCount: result.matchedCount,
                    modifiedCount: result.modifiedCount
                }
            );


            if (result.matchedCount === 0) {

                return res.status(404).json({

                    ok: false,

                    error:
                        `Elemento ${rowId} non trovato nell'array ${array}`

                });

            }


            return res.json({

                ok: true,

                operation:
                    "update-array-element-by-id",

                matchedCount:
                    result.matchedCount,

                modifiedCount:
                    result.modifiedCount,

                array,

                rowId,

                field

            });

        }


        /*
         * =====================================================
         * DA QUI IN POI
         *
         * VECCHIO MECCANISMO CON rowData
         * =====================================================
         */

        if (!rowData || typeof rowData !== "object") {

            return res.status(400).json({

                ok: false,

                error:
                    "Per un array è necessario rowData oppure rowId"

            });

        }


        /*
         * =====================================================
         * COSTRUZIONE DELLA CHIAVE
         * =====================================================
         */

        const rowKey = Object.fromEntries(

            Object.entries(rowData)
                .filter(([key]) => key !== field)

        );


        console.log(
            "rowKey:",
            JSON.stringify(rowKey, null, 2)
        );


        /*
         * =====================================================
         * CERCHIAMO IL RECLAMO
         * =====================================================
         */

        const reclamo = await Reclami.findOne({

            NumReclamo: Number(NumReclamo)

        }).lean();


        if (!reclamo) {

            return res.status(404).json({

                ok: false,

                error:
                    `Reclamo ${NumReclamo} non trovato`

            });

        }


        /*
         * =====================================================
         * RECUPERIAMO L'ARRAY
         * =====================================================
         */

        const arrayData = reclamo[array];


        /*
         * =====================================================
         * CASO 2
         *
         * ARRAY NON ESISTENTE
         * =====================================================
         */

        if (!Array.isArray(arrayData)) {

            const newElement = {
                _id: new mongoose.Types.ObjectId(),
                ...rowData,

                [field]: value

            };


            console.log(
                "ARRAY NON ESISTENTE:",
                array
            );

            console.log(
                "NUOVO ELEMENTO:",
                JSON.stringify(
                    newElement,
                    null,
                    2
                )
            );


            const result = await Reclami.updateOne(

                {
                    NumReclamo:
                        Number(NumReclamo)
                },

                {
                    $set: {
                        [array]: [newElement]
                    }
                }

            );


            return res.json({

                ok: true,

                operation:
                    "create-array",

                matchedCount:
                    result.matchedCount,

                modifiedCount:
                    result.modifiedCount,

                element:
                    newElement

            });

        }


        /*
         * =====================================================
         * CERCHIAMO L'ELEMENTO
         * =====================================================
         */

        const elementIndex =
            arrayData.findIndex(item => {

                if (
                    !item ||
                    typeof item !== "object"
                ) {

                    return false;

                }


                return Object.entries(rowKey)
                    .every(
                        ([key, expectedValue]) => {

                            return String(item[key]) ===
                                String(expectedValue);

                        }
                    );

            });


        console.log(
            "elementIndex:",
            elementIndex
        );


        /*
         * =====================================================
         * CASO 3
         *
         * ELEMENTO ESISTENTE
         * =====================================================
         */

        if (elementIndex !== -1) {

            const result =
                await Reclami.updateOne(

                    {
                        NumReclamo:
                            Number(NumReclamo)
                    },

                    {
                        $set: {
                            [`${array}.${elementIndex}.${field}`]:
                                value
                        }
                    }

                );


            console.log(
                "RISULTATO UPDATE ARRAY:",
                {
                    matchedCount:
                        result.matchedCount,

                    modifiedCount:
                        result.modifiedCount,

                    array,

                    elementIndex,

                    field,

                    value
                }
            );


            return res.json({

                ok: true,

                operation:
                    "update-array-element",

                matchedCount:
                    result.matchedCount,

                modifiedCount:
                    result.modifiedCount,

                array,

                index:
                    elementIndex

            });

        }


        /*
         * =====================================================
         * CASO 4
         *
         * ELEMENTO NON ESISTENTE
         * =====================================================
         */

        const newElement = {
            _id: new mongoose.Types.ObjectId(),
            ...rowData,
            [field]: value
        };

        console.log(
            "ELEMENTO NON ESISTENTE"
        );

        console.log(
            "NUOVO ELEMENTO:",
            JSON.stringify(
                newElement,
                null,
                2
            )
        );


        const result =
            await Reclami.updateOne(

                {
                    NumReclamo:
                        Number(NumReclamo)
                },

                {
                    $push: {
                        [array]:
                            newElement
                    }
                }

            );


        return res.json({

            ok: true,

            operation:
                "add-array-element",

            matchedCount:
                result.matchedCount,

            modifiedCount:
                result.modifiedCount,

            element:
                newElement

        });


    } catch (error) {

        console.error(
            "ERRORE PATCH RECLAMO:",
            error
        );


        return res.status(500).json({

            ok: false,

            error: error.message

        });

    }

});

app.post('/Reclami', async (req, res) => {
  try {
    console.log('BODY RICEVUTO:', req.body);

    // 1️⃣ Crea e salva il documento
    const nuovoDocumento = new Reclami(req.body);
    const result = await nuovoDocumento.save();

    console.log('ID generato da Mongoose:', result._id);

    // 2️⃣ Verifica subito che il documento sia nel DB
    const trovato = await Reclami.findById(result._id);
    if (trovato) {
      console.log('Documento confermato nel DB:', trovato);
    } else {
      console.warn('Documento NON trovato nel DB!');
    }

    // 3️⃣ Risposta al client
    return res.status(201).json({
      message: 'Reclamo inserito correttamente',
      insertedId: result._id,
      trovato: !!trovato
    });

  } catch (err) {
    console.error('ERRORE INSERIMENTO RECLAMO:', err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Errore durante l’inserimento", error: err.message });
    }
  }
});

app.put('/Reclami/:id', async (req, res) => {
  const { id } = req.params;

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  );

  res.json(result);
});


app.get("/api/file/:tipoFile", async (req, res) => {
  try {
    const tipoFile = req.params.tipoFile;

    const listaFile = await File.find({
      tipo: tipoFile
    }).lean();

    res.json(listaFile);

  } catch (error) {
    console.error("Errore recupero file:", error);
    res.status(500).json({ error: error.message });
  }
});


const viste = {
    reclamiLettere: "ReclamiLettere",
    reclamiCheckRischi: "ReclamiCheckRischi",
    reclamiRischi: "ReclamiRischi",
    reclamiArera: "ReclamiArera",
    reclamiUploadClienteFinale: "ReclamiUploadClienteFinale",
    reclamiUploadUtility: "ReclamiUploadUtility",
    reclamoCompleto: "Reclami"
};


app.get('/reclami/:vista/:NumReclamo', async (req, res) => {

    try {
        const NumReclamo = parseInt(req.params.NumReclamo, 10);
        const modelName = viste[req.params.vista];
    
        if (!modelName) {
            return res.status(400).json({
                message: 'Vista non valida: ' + req.params.vista
            });
        }

        const Model = getViewModel(modelName);

        const reclamo = await Model.findOne({
            NumReclamo
        });

        if (!reclamo) {
            return res.status(404).json({
                message: 'Reclamo non trovato ' + NumReclamo
            });
        }

        res.json(reclamo);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.get("/api/reclami/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") return res.json([]);

    const risultati = await Reclami.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    res.json(risultati);
  } catch (err) {
    console.error("ERRORE MONGO:", err);
    res.status(500).json({ error: "Errore ricerca reclami" });
  }
});

app.get("/api/tipologiche", async (req, res) => {
  const data = await Tipologiche.find().lean();
  res.json(data);
});

/*app.get("/api/listaArera", async (req, res) => {
  const data = await listaArera.find().lean();
  res.json(data);
});*/

/*app.get("/api/listaLettere", async (req, res) => {
  const data = await listaLettere.find().lean();
  res.json(data);
});*/


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server realmente in ascolto sulla porta ${PORT}`);
});