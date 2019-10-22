const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const session = require('express-session');
const db = require('./db');
const {syncAndSeed, models} = db;
const {User}  = models;


syncAndSeed();
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`listening on port ${port}`));


app.use(express.json());
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.use(session({
  secret: 'something',
  resave: false,
  saveUninitialized: true,
}));

app.get('/api/users', (req, res, next)=> {
  User.findAll()
    .then(user => res.send(user))
    .catch(next)
});

app.post('/api/sessions', (req, res, next)=> {
  const user = users[req.body.username];
  if(user){
    req.session.user = user;
    return res.send(user);
  }
  next({ status: 401 });
});


app.get('/api/sessions', (req, res, next)=> {
  const user = req.session.user;
  if(user){
    return res.send(user);
  }
  next({ status: 401 });
});

app.delete('/api/sessions', (req, res, next)=> {
  req.session.destroy();
  res.sendStatus(204);
});

app.get('/', (req, res, next)=> {
  res.sendFile(path.join(__dirname, 'index.html'));
});
