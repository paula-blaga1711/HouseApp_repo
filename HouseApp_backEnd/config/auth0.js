const User = require('../models/user');
const jwt = require('express-jwt');
//const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
var request = require('request')

global.jwtCheck = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://houseapp.eu.auth0.com/.well-known/jwks.json`
    }),

    issuer: `https://houseapp.eu.auth0.com/`,
    algorithms: ['RS256']
});

app.use(jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://houseapp.eu.auth0.com/.well-known/jwks.json`
    }),
    credentialsRequired: false,
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}));

global.getUserByAuth = async function (user) {
    let loggedIn = await User.getUserByAut0ID(user.sub);
    if (user.email_verified === false) {
        return 'notConfirmed';
    }

    if (loggedIn && loggedIn != null) {
        return loggedIn;
    } else return null;
}

var optionsGetToken = {
    method: 'POST',
    url: 'https://houseapp.eu.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: '{"grant_type":"client_credentials","client_id":"OiESYl16IsP8RLc3Oi2M573dHmrVOafu","client_secret":"Elu-s_X81bK06wAYpLDPPqgDDeWP2eyCBfdRvyqd9U-o_uJ6Eowr-_LRBhDS_4dG","audience":"https://houseapp.eu.auth0.com/api/v2/"}'
};

global.GetAuth0Token = function () {
    return new Promise(resolve => {
        request(optionsGetToken, function (error, response, body) {
            if (error) {
                console.log(error);
                resolve(null);
                return null;
            } else {
                let receivedBodyObject = JSON.parse(body);
                auth0Token = receivedBodyObject.access_token;

                resolve(auth0Token);
                return auth0Token;
            }
        });
    })
};

global.DeleteAuth0User = function (userID, token) {
    return new Promise(resolve => {
        request({
            method: 'DELETE',
            url: `https://houseapp.eu.auth0.com/api/v2/users/${userID}`,
            headers: { 'Authorization': `Bearer ${token}` },
        }, function (error, response, body) {
            if (error) {
                console.log(error);
                resolve(null);
                return null;
            } else {
                status = response.statusCode;
                resolve(status);
                return status;
            }
        });
    });
}

var optionsCreateUser = {
    method: 'POST',
    url: 'https://houseapp.eu.auth0.com/dbconnections/signup',
    headers: { 'content-type': 'application/json' },
    body:
    {
        client_id: 'MDjkXRnBL4HJiVumH41IQm2RvTkBI7jX',
        email: '',
        password: '',
        connection: 'Username-Password-Authentication',
        user_metadata: { name: '' }
    },
    json: true
};

global.signUpToAuth0 = function (userEmail, userPassword) {
    let authID = null;
    optionsCreateUser.body.email = userEmail;
    optionsCreateUser.body.password = userPassword;
    optionsCreateUser.body.user_metadata.name = userEmail;

    return new Promise(resolve => {
        request(optionsCreateUser, function (error, response, body) {
            if (error) {
                console.log(error);
                resolve(null);
                return null;
            } else {
                authID = 'auth0|' + body._id;
                resolve(authID);
                return authID;
            }
        });
    });
}