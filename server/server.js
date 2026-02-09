import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Reclami from "./models/reclamiModel.js";
import Tipologiche from "./models/tipologicheModel.js";

console.log("✅ SERVER JS IN ESECUZIONE DA:", process.cwd());

const app = express();
app.use(cors({
  origin: '*',            // tutte le origini
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Connessione a MongoDB
mongoose.connect("mongodb+srv://ue_amontefusco:AQUILOTTO@clusterm2.5cykqpk.mongodb.net/Percipio?retryWrites=true&w=majority")
  .then(() => console.log("✅ Connessione a MongoDB riuscita"))
  .catch(err => console.error("❌ Errore connessione MongoDB:", err.message));


console.log('Checkpoint'); // per vedere se il server arriva lì
debugger;

import { ObjectId } from "mongodb";


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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server avviato su http://localhost:${PORT}`));
