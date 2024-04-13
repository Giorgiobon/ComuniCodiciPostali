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

app.get('/codici', (req, res) => {
  res.render(specificViewPath);
});

app.post('/login/log', express.json(), (req, res) => {
});

app.delete('/deleteCampaign/:id', (req, res) => {
});

export default app;