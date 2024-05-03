import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import database from './dataBase.js';
import bodyParser from 'body-parser';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();

app.set('view engine', 'pug');

const specificViewPath = path.join(__dirname, 'pages', 'home.pug');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: 'Session',
    secret: 'Secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, expires: 60000 }
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get('/', (req, res) => {
  res.render(specificViewPath);
});

app.post('/cerca', (req, res) => {
  const { comuneName, capComune } = req.body;
  const query = 'SELECT COMUNE, CAP FROM CodiciPostali WHERE COMUNE = ? OR CAP = ?';
  database.query(query, [comuneName, capComune], (error, result) => {
    if (error) {
      console.error('Errore nella query:', error);
      res.status(500).send('Errore del server');
    } else {
      const comuni = result.map(row => ({
        comune: row.COMUNE,
        cap: row.CAP
      }));
      res.json(comuni);
    }
  });
});

app.post('/aggiungi', (req, res) => {
  const { nuovoNomeComune, nuovoCapComune } = req.body;
  const query = 'INSERT INTO CodiciPostali (COMUNE, CAP) VALUES (?, ?)';
  database.query(query, [nuovoNomeComune, nuovoCapComune], (error, result) => {
    if (error) {
      console.error('Errore nella query:', error);
      res.status(500).send('Errore del server');
    }
  });
});

app.post('/modifica', (req, res) => {
  const { comuneName, comuneCap, nuovoNomeComune, nuovoCapComune } = req.body;
  const query = 'UPDATE CodiciPostali SET COMUNE = ?, CAP = ? WHERE COMUNE = ? AND CAP = ?';
  database.query(query, [nuovoNomeComune, nuovoCapComune, comuneName, comuneCap], (error, result) => {
    if (error) {
      console.error('Errore nella query:', error);
      res.status(500).send('Errore del server');
    } else {
      console.log(comuneName, comuneCap, nuovoNomeComune, nuovoCapComune);
      console.log(result);
      res.sendStatus(200);
    }
  });
});

app.delete('/elimina', (req, res) => {
  const { comuneName, comuneCap } = req.body;
  const query = 'DELETE FROM CodiciPostali WHERE COMUNE = ? AND CAP = ?';
  database.query(query, [comuneName, comuneCap], (error, result) => {
    if (error) {
      console.error('Errore nella query:', error);
      res.status(500).send('Errore del server');
    } else {
      res.sendStatus(200);
    }
  });
});

export default app;