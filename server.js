console.log('Hola, pepsicola');

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

MongoClient.connect('mongodb://cagao:cagao@ds119368.mlab.com:19368/star-wars-quotes', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(3000, function(){
    console.log('listening on 3000');
  });
});



// app.get('/', function(req, res){
//   res.send('Hola, pepsicola');
// });
// La misma función, pero escrita en ES6
// app.get('/', (req, res) => {
//   res.send('Hola, pepsicola');
// });

app.get('/', (req, res) => {
  var cursor = db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err);
    // render index.ejs
    res.render('index.ejs', {quotes: result})
  });
  // res.sendFile(__dirname + '/index.html')
  // __dirname contiene el path al directorio que contiene el código fuente Javascript.
});

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  });
});

app.use(bodyParser.json());

app.put('/quotes', (req, res) => {
  db.collection('quotes')
    .findOneAndUpdate(
      {name: 'Hola'},
      {
        $set:{
          name: req.body.name,
          quote: req.body.quote
        }
      },
      {
        sort: {_id: 1},
        upsert: true
      },
      (err, result) => {
        if (err) return res.send(err);
        res.send(result);
      }
  );
});


app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete(
        {name: req.body.name},
        (err, result) => {
          if (err) return res.send(500, err);
          res.send('A Darth Vader quote got deleted');
        }
  );
});
