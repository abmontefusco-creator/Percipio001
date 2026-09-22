import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Reclami from "./models/reclamiModel.js";
import Tipologiche from "./models/tipologicheModel.js";
//import listaArera from "./models/listaAreraModel.js";
//import listaLettere from "./models/listaLettereModel.js";
import { ObjectId } from "mongodb";
import File from "./models/fileModel.js";
//import ReclamiArera from "./models/ReclamoArera.js";
//import ReclamiLettere from "./models/ReclamoLettere.js";
//import ReclamiRischi from "./models/ReclamoRischi.js";
//import ReclamiCheckRischi from "./models/ReclamoCheckRischi.js";
import {getViewModel} from "./models/createViewModel.js";

console.log("✅ SERVER JS IN ESECUZIONE DA:", process.cwd());

const app = express();
app.use(cors());
app.use(express.json());

// Connessione a MongoDB
mongoose.connect("mongodb+srv://ue_amontefusco:AQUILOTTO@clusterm2.5cykqpk.mongodb.net/Percipio?retryWrites=true&w=majority")
  .then(() => console.log("✅ Connessione a MongoDB riuscita"))
  .catch(err => console.error("❌ Errore connessione MongoDB:", err.message));


console.log('Checkpoint'); // per vedere se il server arriva lì
debugger;


app.patch("/api/reclami/:NumReclamo", async (req, res) => {

    try {

        const { NumReclamo } = req.params;

        const {
            field,
            value,
            array,
            rowData
        } = req.body;


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
         * VALIDAZIONE ARRAY
         * =====================================================
         */

        if (!rowData || typeof rowData !== "object") {

            return res.status(400).json({
                ok: false,
                error: "Per un array è necessario rowData"
            });

        }


        /*
         * =====================================================
         * COSTRUZIONE DELLA CHIAVE
         *
         * La chiave è composta da TUTTI i campi
         * di rowData TRANNE field.
         *
         * Esempio:
         *
         * rowData:
         *
         * {
         *   nome: "Morosità e Sospensione",
         *   codice: "MOR",
         *   presente: 1
         * }
         *
         * field:
         *
         * "presente"
         *
         * chiave:
         *
         * {
         *   nome: "Morosità e Sospensione",
         *   codice: "MOR"
         * }
         * =====================================================
         */

        const rowKey = Object.fromEntries(

            Object.entries(rowData)
                .filter(([key]) => key !== field)

        );


        console.log(
            "===== PATCH RECLAMO ====="
        );

        console.log(
            "NumReclamo:",
            NumReclamo
        );

        console.log(
            "array:",
            array
        );

        console.log(
            "field:",
            field
        );

        console.log(
            "value:",
            value
        );

        console.log(
            "rowData:",
            JSON.stringify(rowData, null, 2)
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
                error: `Reclamo ${NumReclamo} non trovato`
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
         *
         * Creiamo l'array.
         * =====================================================
         */

        if (!Array.isArray(arrayData)) {

            const newElement = {
                ...rowData,
                [field]: value
            };


            console.log(
                "ARRAY NON ESISTENTE:",
                array
            );

            console.log(
                "NUOVO ELEMENTO:",
                JSON.stringify(newElement, null, 2)
            );


            const result = await Reclami.updateOne(

                {
                    NumReclamo: Number(NumReclamo)
                },

                {
                    $set: {
                        [array]: [newElement]
                    }
                }

            );


            return res.json({

                ok: true,

                operation: "create-array",

                matchedCount: result.matchedCount,

                modifiedCount: result.modifiedCount,

                element: newElement

            });

        }


        /*
         * =====================================================
         * CERCHIAMO L'ELEMENTO NELL'ARRAY
         *
         * Confrontiamo TUTTI i campi della chiave.
         *
         * Esempio:
         *
         * rowKey:
         *
         * {
         *   nome: "Morosità e Sospensione",
         *   codice: "MOR"
         * }
         *
         * L'elemento deve avere entrambi i valori uguali.
         * =====================================================
         */

        const elementIndex = arrayData.findIndex(item => {

            if (!item || typeof item !== "object") {
                return false;
            }


            return Object.entries(rowKey).every(
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
         * ARRAY ESISTENTE
         * ELEMENTO ESISTENTE
         *
         * Aggiorniamo solamente il campo richiesto.
         * =====================================================
         */

        if (elementIndex !== -1) {

            const result = await Reclami.updateOne(

                {
                    NumReclamo: Number(NumReclamo)
                },

                {
                    $set: {
                        [`${array}.${elementIndex}.${field}`]: value
                    }
                }

            );


            console.log(
                "RISULTATO UPDATE ARRAY:",
                {
                    matchedCount: result.matchedCount,
                    modifiedCount: result.modifiedCount,
                    array,
                    elementIndex,
                    field,
                    value
                }
            );


            return res.json({

                ok: true,

                operation: "update-array-element",

                matchedCount: result.matchedCount,

                modifiedCount: result.modifiedCount,

                array,

                index: elementIndex

            });

        }


        /*
         * =====================================================
         * CASO 4
         *
         * ARRAY ESISTENTE
         * ELEMENTO NON ESISTENTE
         *
         * Creiamo un nuovo elemento.
         * =====================================================
         */

        const newElement = {

            ...rowData,

            [field]: value

        };


        console.log(
            "ELEMENTO NON ESISTENTE"
        );

        console.log(
            "NUOVO ELEMENTO:",
            JSON.stringify(newElement, null, 2)
        );


        const result = await Reclami.updateOne(

            {
                NumReclamo: Number(NumReclamo)
            },

            {
                $push: {
                    [array]: newElement
                }
            }

        );


        return res.json({

            ok: true,

            operation: "add-array-element",

            matchedCount: result.matchedCount,

            modifiedCount: result.modifiedCount,

            element: newElement

        });


    } catch (error) {

        console.error(
            "Errore aggiornamento reclamo:",
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
    reclamiUploadUtility: "ReclamiUploadUtility"
};

app.get('/reclami/:vista/:NumReclamo', async (req, res) => {
    console.log("=================================");
    console.log("ROUTE /reclami/:vista/:NumReclamo");
    console.log("req.params:", req.params);
    console.log("vista:", viste[req.params.vista]);
    console.log("NumReclamo:", req.params.NumReclamo);
    console.log("=================================");

    try {
        const NumReclamo = parseInt(req.params.NumReclamo, 10);
        const modelName = viste[req.params.vista];
        console.log("modelName:", modelName);
    
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

/*
app.get('/reclamiLettere/:NumReclamo', async (req, res) => {
    try {
        const NumReclamo = parseInt(req.params.NumReclamo, 10);

        const reclamo = await ReclamiLettere.findOne({
            NumReclamo : NumReclamo
        });

        if (!reclamo) {
            return res.status(404).json({ message: 'Reclamo non trovato ' + NumReclamo });
        }

        res.json(reclamo);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/reclamiCheckRischi/:NumReclamo', async (req, res) => {
    try {
        const NumReclamo = parseInt(req.params.NumReclamo, 10);

        const reclamo = await ReclamiCheckRischi.findOne({
            NumReclamo : NumReclamo
        });

        if (!reclamo) {
            return res.status(404).json({ message: 'Reclamo non trovato ' + NumReclamo });
        }

        res.json(reclamo);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/reclamiRischi/:NumReclamo', async (req, res) => {
    try {
        const NumReclamo = parseInt(req.params.NumReclamo, 10);
        const reclamo = await ReclamiRischi.findOne({
            NumReclamo: NumReclamo
        });

        if (!reclamo) {
            return res.status(404).json({ message: 'Reclamo non trovato ' + NumReclamo });
        }

        res.json(reclamo);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/reclamiArera/:NumReclamo', async (req, res) => {
    try {
        const NumReclamo = parseInt(req.params.NumReclamo, 10);

        const reclamo = await ReclamiArera.findOne({
            NumReclamo : NumReclamo
        });

        if (!reclamo) {
            return res.status(404).json({ message: 'Reclamo non trovato ' + NumReclamo });
        }

        res.json(reclamo);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
*/
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

app.get("/api/listaArera", async (req, res) => {
  const data = await listaArera.find().lean();
  res.json(data);
});

app.get("/api/listaLettere", async (req, res) => {
  const data = await listaLettere.find().lean();
  res.json(data);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server realmente in ascolto sulla porta ${PORT}`);
});