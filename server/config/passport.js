var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var users = require('../../client/models/users.js');
var pg = require('pg');
var pgSession = require('connect-pg-simple')(session);
    // ****************
    // load up the user model (user schema)
    //var User = require('../models/user.js');

// load up the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
//module.exports = function(passport) {
module.exports = function(app, express) {
    // required for persistent login sessions : passport needs to serialize and unserialize users out of session
    // required for passport
    app.use(session({
        store: new pgSession({
            pg: pg,
            conString: 'postgresql://localhost/yumsnap',
            tableName: 'session'
        }),
        secret: 'ilovescotchscotchyscotchscotch'
    })); // session secret

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session
    app.use(cookieParser('ilovescotchscotchyscotchscotch'));
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.facebookId);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {

        console.log('deserial Obj:', id);

        return Users.getUser({ facebookId: id })
            .then(function(user) {
                console.log(user);
                return done(null, user);
            })
            .catch(function(err) {
                console.error(err)
            })
    });


    // FACEBOOK
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL

        },
        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            console.log("I am token ", token);
            console.log("I am refreshToken ", refreshToken);
            console.log("I am profile ", profile);
            console.log("I am done ", done);

            // asynchronous
            process.nextTick(function() {

         //DATABASE STUFF LATER! 
                // find the user in the database based on their facebook id
                // User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                //     // if there is an error, stop everything and return that
                //     // ie an error connecting to the database
                //     if (err)
                //         return done(err);

                //     // if the user is found, then log them in
                //     if (user) {
                //         return done(null, user); // user found, return that user
                //     } else {
                //         // if there is no user found with that facebook id, create them
                //         var newUser            = new User();

                //         // set all of the facebook information in our user model
                //         newUser.facebook.id    = profile.id; // set the users facebook id                   
                //         newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                //         newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                //         newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                //         // save our user to the database
                //         newUser.save(function(err) {
                //             if (err)
                //                 throw err;

                //             // if successful, return the new user
                //             return done(null, newUser);
                //         });
                //     } // close else

                // });
                return Users.getUser({ facebookId: profile.id })
                    .then(function(user) {
                        if (user) {
                            return done
                        } else {
                            // set all of the facebook information in our user model
                            var userProfile = {
                                facebook_id : profile.id, // set the users facebook id                   
                                token : token, // we will save the token that facebook provides to the user                    
                                username : profile.name.givenName + ' ' + profile.name.familyName, // look at the passport user profile to see how names are returned
                                email : profile.emails[0].value // facebook can return multiple emails so we'll take the first
                            }

                            return Users.createUser(userProfile)
                                .then(function(data) {
                                    userProfile.id = data
                                    return Users.addAuth({ user_id: data, auth_token: token })
                                        .then(function() {
                                            return done(null, userProfile);
                                        })
                                })

                        } // close else

                    }) // close .then
            

            });

        }));

    // fb token close FN




    // TWITTER
    passport.use(new TwitterStrategy({

            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL

        },
        function(token, tokenSecret, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function() {

                // User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

                //     // if there is an error, stop everything and return that
                //     // ie an error connecting to the database
                //     if (err)
                //         return done(err);

                //     // if the user is found then log them in
                //     if (user) {
                //         return done(null, user); // user found, return that user
                //     } else {
                //         // if there is no user, create them
                //         var newUser                 = new User();

                //         // set all of the user data that we need
                //         newUser.twitter.id          = profile.id;
                //         newUser.twitter.token       = token;
                //         newUser.twitter.username    = profile.username;
                //         newUser.twitter.displayName = profile.displayName;

                //         // save our user into the database
                //         newUser.save(function(err) {
                //             if (err)
                //                 throw err;
                //             return done(null, newUser);
                //         });
                //     }
                // });

                if (auth.use_database === 'true') {
                    //do DB STUFF
                }
                return done(null, profile);


            });

        }));
    // close twitter strategy

}; // close entire exports FN? sublime highlights this as extra.
