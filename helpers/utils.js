module.exports.shuffleArray = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports.mimeTypes = [
  { mimetype: "application/rss+xml",   feedtype: "xml" },
  { mimetype: "application/rdf+xml",   feedtype: "xml" },
  { mimetype: "application/atom+xml",  feedtype: "xml" },
  { mimetype: "application/xml",       feedtype: "xml" },
  { mimetype: "application/x-rss+xml", feedtype: "xml" },
  { mimetype: "text/xml",              feedtype: "xml" },
  { mimetype: "application/json",      feedtype: "json" },
]

module.exports.showcasedFeedsUrls = [
  "https://jsonfeed.org/feed.json",
  "https://daringfireball.net/feeds/json",
  "http://inessential.com/feed.json",
  "http://phish.net/feed.json",
  "https://www.stuartbreckenridge.com/feed.json",
  "https://applefocus.com/feed.json",
  "http://www.downes.ca/news/OLDaily.json",
  "https://www.raymondcamden.com/jsonfeed/index.json",
  "https://longstride.net/feed.json",
  "https://ryanmo.co/feed.json",
  "http://troz.net/feed.json",
  "https://www.jordanmerrick.com/feed.json",
  "http://gaddgict.com/feed/json",
  "https://colterreed.com/feed/json",
  "https://ndarville.com/feed.json",
  "http://thaddeushunt.com/feed/json",
  "http://andrewjaffe.net/blog/feed.json",
  "https://christine.website/blog.json",
  "https://www.dwell.com/@dwell/json",
  "http://uncrate.com/feed.json",
  "http://macosicongallery.com/feed.json",
  "http://iosicongallery.com/feed.json",
  "http://hipsterpixel.co/feed.json",
]
