import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import database from './dataBase.js';
import * as url from 'url';



const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();

app.set('view engine', 'pug');

const specificViewPath = path.join(__dirname, 'pages', 'home.pug');

// global middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(
  session({
    name:'Session',
    secret: 'Secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, expires:60000 }
  })
);

// Aggiorna questo middleware per servire i file statici dalla directory 'loginAndRegister'
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
    res.render(specificViewPath);
});

app.post('/cerca', (req, res) => {
  const {comune, cap} = req.body;
  const query = 'SELECT COMUNE, CAP FROM CodiciPostali WHERE COMUNE = ? OR CAP = ?';
  database.query(query, [comune, cap], (error, result) =>{
    if (error) {
      console.error('Errore nella query:', err);
      res.status(500).send('Errore del server');
    } else {
      console.log(result);
      const comuni = result.map(row => ({
        comune: row.Comune,
        cap: row.CAP
      }));
      res.json(comuni);
    }
  }); 
});

app.post('/aggiungi', express.json(), (req, res) => {
  const {comuneName, comuneCap} = req.body;
  const query = 'INSERT INTO CodiciPostali (COMUNE, CAP) VALUES ( ?, ?)';
  database.query(query, [comuneName, comuneCap], (error, result) =>{
    if (error) {
      console.error('Errore nella query:', err);
      res.status(500).send('Errore del server');
    }
  }); 
});

app.post('/modifica', express.json(), (req, res) => {
  const {comuneName, comuneCap, nuovoNomeComune, nuovoCapComune} = req.body;
  const query = 'UPDATE CodiciPostali SET COMUNE = ? , CAP = ?  WHERE COMUNE = ? OR CAP = ?';
  database.query(query, [comuneName, comuneCap, nuovoNomeComune, nuovoCapComune], (error, result) =>{
    if (error) {
      console.error('Errore nella query:', err);
      res.status(500).send('Errore del server');
    }
  }); 
});

app.delete('/elemina', (req, res) => {
  const { comuneName, comuneCap } = req.body;
  const query = 'DELETE FROM CodiciPostali WHERE COMUNE = ? AND CAP = ?';
  database.query(query, [ comuneName, comuneCap ], (error, result) =>{
    if (error) {
      console.error('Errore nella query:', err);
      res.status(500).send('Errore del server');
    }
  }); 
});

export default app;