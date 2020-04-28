const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database');
const app = express();
const passport = require('passport');
const users = require('./routes/api/users');
const lives = require('./routes/api/liveRoutes');
const seeding = require('./config/seeding');
const Live = require('./models/live');
const axios = require('axios');
const get_stream = function(timeout = 100000) {
  console.log("start scrapping");

  axios({
    method: "get",
    url: "https://api.twitch.tv/kraken/streams/?language=fr",
    headers: {
      Accept: "application/vnd.twitchtv.v5+json",
      "Client-ID": "ufqh8u67gc9u1ny6me1rpvygdjkzza"
    }
  })
    .then(res => {
      let result = res.data;
      result.streams.map(({ _id, ...live }) => {
        live["id"] = _id;
        Live.update({ id: _id }, { ...live }, { upsert: true })
          .then(res => {})
          .catch(err => console.log(err));
      });
    })
    .catch(err => console.log(err));
}

//* Parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/*
 * Set PORT
 */
const port = process.env.PORT || 5000;

/*
 * DB Config
 */
db();

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/api/users', users);
app.use('/api', lives)

/*
 * Load server routes
 */
app.get('/', function (req, res) {
  res.json({ version: '1.0.0' });
});
app.get('/seed', function (req, res) {
  seeding();
  res.json({ msg: 'Done.' });
});

/*
* Strapping
*/
get_stream();

/*
 * Start server
 */
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
