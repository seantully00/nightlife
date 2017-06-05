'use strict';

var https = require('https');

var User = require('../../../users/server/models/user.server.model');

var Bar = require('../../../users/server/models/bar.server.model');

var results = [];

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
        //console.log(prettyJson);
        res.json(results);
        //console.log(results[0].id);
        for (var i=0; i<results.length; i++) {
          console.log(results[i].id);
          Bar.findOne({ 'yelpid': results[i].id }).then(response => {
            if (response) {
              console.log(response);
            } else {
              //console.log(response);
              var newBar = new Bar();
              newBar.name = results[i].name;
              console.log(newBar.name);
              newBar.id = results[i].id;
              newBar.yelprating = results[i].rating;
              newBar.visitors  = [];
              console.log(newBar);
              newBar.save(function (err) {
                if (err) {
                  throw err;
                }
          });
          }
        });
        /*Bar.findOne({ 'id': results[i].id }, function (err, bar) {
          //console.log(bar);
          if (err) {
            return err;
          }
          if (bar) {
            return bar;
          } else {
            var newBar = new Bar();
            newBar.name = results[i].name;
            newBar.id = results[i].id;
            newBar.yelprating = results[i].rating;
            newBar.visitors  = [];
            newBar.save(function (err) {
              if (err) {
                throw err;
              }
        });
        }
      });*/
        }
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
      //console.log(user);
});
  });



  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
