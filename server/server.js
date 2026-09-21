import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Reclami from "./models/reclamiModel.js";
import Tipologiche from "./models/tipologicheModel.js";
//import listaArera from "./models/listaAreraModel.js";
//import listaLettere from "./models/listaLettereModel.js";
import { ObjectId } from "mongodb";
import File from "./models/fileModel.js";
import ReclamiArera from "./models/ReclamoArera.js";
import ReclamiLettere from "./models/ReclamoLettere.js";
import ReclamiRischi from "./models/ReclamoRischi.js";



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
            rowKeyField,
            rowKey,
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
                {NumReclamo:  Number(NumReclamo)},
                {$set: {
                        [field]: value
                    }});


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

        if (!rowKeyField) {
            return res.status(400).json({
                ok: false,
                error: "Per un array è necessario rowKeyField"
            });

        }


        if (rowKey === undefined || rowKey === null) {

            return res.status(400).json({
                ok: false,
                error: "Per un array è necessario rowKey"
            });

        }


        /*
         * =====================================================
         * CERCHIAMO IL RECLAMO
         * =====================================================
         */
        const reclamo = await Reclami.findOne({
            NumReclamo:  Number(NumReclamo)
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
         * Creiamo direttamente l'array
         * con il nuovo elemento.
         * =====================================================
         */

        if (!Array.isArray(arrayData)) {
            const newElement = {
                [rowKeyField]: rowKeyField,
                [field]: rowKey
            };
            /*
             * Se il chiamante ha fornito rowData,
             * utilizziamo anche gli altri dati
             * dell'elemento.
             */
            if (rowData && typeof rowData === "object") {
                Object.assign(newElement, rowData);
                /*
                 * Il valore ricevuto nel PATCH
                 * deve avere la precedenza.
                 */
                newElement[rowKeyField] = rowKey;
                newElement[field] = value;
            }
            console.log('nn esiste array ' +  array);

            const result = await Reclami.updateOne(
                {NumReclamo:  Number(NumReclamo)},
                {
                    $set: {
                        [array]: [newElement]
                    }
                }
            );
            console.log('nn esiste array ' +  JSON.stringify(result, null, 2));


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
         * =====================================================
         */

        const elementIndex = arrayData.findIndex(
            item =>
                item &&
                item[rowKeyField] !== undefined &&
                String(item[rowKeyField]) === String(rowKey)
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
                    NumReclamo:  Number(NumReclamo)
                },
                {
                    $set: {
                        [`${array}.${elementIndex}.${field}`]: value
                    }
                }
            );


            return res.json({

                ok: true,

                operation: "update-array-element",

                matchedCount: result.matchedCount,

                modifiedCount: result.modifiedCount,

                array: array,

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
         * Creiamo un nuovo elemento e facciamo PUSH.
         * =====================================================
         */

        const newElement = {

            [rowKeyField]: rowKey,

            [field]: value

        };


        /*
         * Se è stato passato rowData,
         * completiamo il nuovo elemento.
         */

        if (rowData && typeof rowData === "object") {

            Object.assign(newElement, rowData);

            /*
             * Garantiamo che la chiave e il valore
             * del PATCH abbiano la precedenza.
             */

            newElement[rowKeyField] = rowKey;

            newElement[field] = value;

        }


        const result = await Reclami.updateOne(
            {
                NumReclamo:  Number(NumReclamo)
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

app.get('/reclamiRischi/:NumReclamo', async (req, res) => {
    try {
        console.log("PARAMETRO:", req.params.NumReclamo);

        const NumReclamo = parseInt(req.params.NumReclamo, 10);

        console.log("NUMERO:", NumReclamo);
        console.log("MODELLO:", ReclamiRischi);

        const reclamo = await ReclamiRischi.findOne({
            NumReclamo: NumReclamo
        });

        console.log("RISULTATO:", reclamo);

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