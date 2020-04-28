const axios = require('axios');
const Live = require('../app/models/live');
const routers = require('../routes/api/liveRoutes');

axios.default.headers.common['Client-ID'] = "ufqh8u67gc9u1ny6me1rpvygdjkzza";

const get_streams = function () {
  console.log('start scrapping');
  let streams = await axios({
    method: "get",
    url: "https://api.twitch.tv/kraken/streams/?language=fr",
  })
  
  console.log(streams);
};

module.exports = get_streams;
