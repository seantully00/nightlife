'use strict';

var https = require('https');

var User = require('../../../users/server/models/user.server.model');

var Bar = require('../../../users/server/models/bar.server.model');

var results = [];

var visitors = [];

const yelp = require('yelp-fusion');

var zip;

/*const searchRequest = {
  term:'bar',
  location: 'new york, ny'
};*/

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Yelp search

  //app.route('/results')
  app.route('/search')
    .post(function (req, res) {
      console.log(req.body);
      yelp.accessToken(process.env.YELP_CLIENT_ID, process.env.YELP_CLIENT_SECRET).then(response => {
        const client = yelp.client(response.jsonBody.access_token);
        client.search({term:'bar', location: req.body.zip}).then(response => {
        results = response.jsonBody.businesses;
        const prettyJson = JSON.stringify(results, null, 4);

        results.forEach(function(bar, index){

          User.find( {'checkedin': bar.id}).then(response => {
            results[index].users = response;
            if (index === results.length-1) {
              res.json(results);
              console.log(results);
            }
            if (response.length > 0) {
              console.log(response);
              //console.log(response);
            } else {
                console.log('nope');
              }
            });

        });

}).catch(e => {
  console.log(e);
});
});
});

app.route('/checkin')
  .post(function (req, res) {
    //console.log(req.body.id);
    User.findById(req.user._id, function(err, user){
      //console.log(user);
      user.checkedin = req.body.id;
      user.save();
      res.json(user);
});
  });

app.route('/checkout')
    .post(function (req, res) {
      //console.log(req.body.id);
      User.findById(req.user._id, function(err, user){
        //console.log(user);
        user.checkedin = '';
        user.save();
        res.json(user);
  });
    });



  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
