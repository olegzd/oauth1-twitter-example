/**
* Created by Oleg Zdornyy to help paint a better picture 
* (with pretty comments) of how to use OAuth 1 to authenticate
* with Twitter. 
*
* Quick Note: this is good for using with... 1 customer. 
* Use a better way of storing the request tokens (i.e. can handle more
* than one at a time...) 
*/

var http = require('http');
var oauth = require('oauth').OAuth;
var express = require('express');
var app = express();

const callbackURL = 'http://localhost:5001/oauth_callback';

// A little tip: Don't commit your key, secret here ;) that's recipe for trouble
const yourConsumerKey = 'your Twitter consumer key (for this app)';
const yourConsumerSecret = 'and the secret';

// Might want to use Redis for this key(s) store (in case your service goes down half way through
// the authentication process)
var reqToken; // This will change!
var reqTokenSecret;   // This will change constantly




/**
 * STEP 1 - init the OAuth Client!
 */
var oa = new oauth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    yourConsumerKey,            // CONSUMER KEY
    yourConsumerSecret,         // CONSUMER SECRET
    '1.0',
    callbackURL,
    'HMAC-SHA1'
  );


app.get('/', function(req, res){


  /**
   * STEP 2: Ask twitter for a signed request token
   */
  oa.getOAuthRequestToken(function (error, requestToken, requestTokenSecret, results) {
    if(error){
      res.send(error);
      return;
    }

    reqToken = requestToken;
    reqTokenSecret = requestTokenSecret;

    /**
     * STEP 3: Redirect the user using the request token Twitter gave us up above
     */
    var redirectURL = 'https://api.twitter.com/oauth/authorize'+'?oauth_token='+requestToken;
    res.redirect(redirectURL);

  });
});


app.get('/oauth_callback', function(req, res){

  /**
   * STEP 4: Twitter has redirected the user back to your site.
   * Get the access token and access token secret - store this in your database (you want
   * to keep this).
   */
  oa.getOAuthAccessToken(req.query.oauth_token, reqTokenSecret, req.query.oauth_verifier,
    function(error,
             oAuthAccessToken,
             oAuthAccessTokenSecret,
             results){

      // Call to store access token/secret here

  });

  res.send('Done');
});

app.listen(5001, function(){
  console.log('Listening on port 5001');
});

