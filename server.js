const express = require('express')
const app = express();
const port = 5050;

app.set('views', './views')
app.set('view engine', 'ejs');

// app.[VERB]([PATH], function(req, res) { //what to do})

app.get('/', (req, res) => {
  res.render('home.ejs')
});
app.listen(port, () => { console.log(`Express app listening for 50-50's on port ${port}`);})
