const User = require('../models/user');
const jwt = require('express-jwt');
//const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

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