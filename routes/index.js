/*---------------------------------------------------------------------
  Dependencies
---------------------------------------------------------------------*/
var express = require('express');
var router = express.Router();
var request = require("request");
var async = require("async");
var utils = require("../helpers/utils")
var redisCache = require('redis').createClient(process.env.REDIS_URL);
var Promise = require("bluebird");
Promise.promisifyAll(require("redis"));

/*---------------------------------------------------------------------
  Homepage GET
---------------------------------------------------------------------*/
router.get('/',

  // backward compatibility with previously used URL (...herokuapp.com/?feed_url=http...)
  function redirectToFeed(req, res, next){
    if(req.query.feed_url){
      return res.redirect("/feed/?url="+encodeURIComponent(req.query.feed_url.trim()))
    }
    else{
      return next();
    }
  },

  function getShowcasedFeeds(req, res, next){

    res.locals.showcasedFeeds = []

    var calls = [];

    utils.showcasedFeedsUrls.forEach(function(url){
      calls.push(function(callback) {

        // check if we already have the data in the Redis cache
        redisCache.get(encodeURIComponent(url.toLowerCase().trim()), function(err, data){
          if (data !== null) {
            res.locals.showcasedFeeds.push(JSON.parse(data));
            return callback()
          }
          else{

            // if we don't have the data in the Redis cache, make the request
            request(url.trim(), function(err, requestResponse, rawData) {

              if(requestResponse && requestResponse.headers && requestResponse.headers["content-type"].indexOf("application/json") > -1){
                var data = JSON.parse(rawData);
                data["fetched_at"] = new Date();
                res.locals.showcasedFeeds.push(data);

                // now that we have the data, push it to the cache (expires after 72 hours)
                redisCache.setex(encodeURIComponent(url.toLowerCase().trim()), 60*60*72, JSON.stringify(data), function(){
                  return callback();
                })
              }
              else{
                return callback(err)
              }
              
            });
          }
        })
      }
    )});

    // get showcased feeds
    async.parallel(calls, function(err, result) {
      if(err){
        //req.flash("error", "Invalid JSON feed.")
      }

      // then, get recently fetched feeds
      redisCache.keys('*', (err, keys) => {
        Promise.all(keys.map(key => redisCache.getAsync(key))).then(values => {
          parsedFeeds = values.map(function(v){
            return v = JSON.parse(v)
          })
          parsedFeeds.sort(function(a,b){
            return new Date(b.fetched_at) - new Date(a.fetched_at);
          });
          parsedFeeds = parsedFeeds.slice(0,9)
          res.locals.latestFeeds = parsedFeeds
          return next();
        });
      });
    });
  },

  function render(req, res, next) {
    utils.shuffleArray(res.locals.showcasedFeeds)
    return res.render("index")
  }

);

/*---------------------------------------------------------------------
  Exports
---------------------------------------------------------------------*/
module.exports = router;