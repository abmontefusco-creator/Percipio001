import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Reclami from "./models/reclamiModel.js";
import Tipologiche from "./models/tipologicheModel.js";
import ARERA from "./models/areraModel.js";

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

import { ObjectId } from "mongodb";
import ReclamiArera from "./models/ReclamoArera.js";
import File from "./models/fileModel.js";


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

app.get('/reclamiArera/:numReclamo', async (req, res) => {
    try {
        const numReclamo = parseInt(req.params.numReclamo, 10);

        const reclamo = await ReclamiArera.findOne({
            NumReclamo : numReclamo
        });

        if (!reclamo) {
            return res.status(404).json({ message: 'Reclamo non trovato ' + numReclamo });
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

app.get("/api/arera", async (req, res) => {
  const data = await ARERA.find().lean();
  res.json(data);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server realmente in ascolto sulla porta ${PORT}`);
});