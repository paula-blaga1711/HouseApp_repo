const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/user');
const Settings = require('../models/setting');

async function deleteUserFromAuth0(user) {
  let auth0Token = await GetAuth0Token();
  if (auth0Token && auth0Token !== null) {
    statusCode = await DeleteAuth0User(user.auth0_id, auth0Token);
    if (statusCode != 200 && statusCode != 204) return false
  } else return false;

  return true;
}

async function checkUserFields(fields) {
  if (_.isEmpty(fields)) return false;
  if (!(_.has(fields, 'name'))) return false;
  if (!(_.has(fields, 'gender'))) return false;
  if (!(_.has(fields, 'email'))) return false;
  if (!(_.has(fields, 'password'))) return false;
  return true
}

async function checkUserFieldsContent(fields) {
  let genders = await Settings.getGenders();
  if (fields.name.length < 3) return false;
  if (genders && !_.includes(genders, fields.gender)) return false;
  if (fields.password.length < 6) return false;
  if (await checkEmailExistence(fields.email) === false) return false;
  return true
}

async function checkEmailExistence(email) {
  DBuser = await User.getUserByEmail(email);
  if (DBuser && DBuser.length == 0) return true;
  return false;
}

router.get('/', jwtCheck, async (req, res) => {
  let loggedInUser = await getUserByAuth(req.user);
  let roles = await Settings.getRoles();

  if (loggedInUser && loggedInUser === null) {
    return res.json({
      status: 'error',
      message: responseMessages['notLoggedIn']
    });
  }

  if (loggedInUser && loggedInUser == 'notConfirmed') {
    return res.json({
      status: 'error',
      message: responseMessages['notConfirmed']
    });
  }

  if (roles && loggedInUser && loggedInUser.role !== roles[0])
    return res.json({
      status: 'error',
      message: responseMessages['unauthorizedAccess']
    });

  let users = await User.getAllUsers();
  if (!_.isEmpty(users))
    return res.json({
      status: 'success',
      users: users
    });
  else
    return res.json({
      status: 'error',
      message: responseMessages['generalError']
    });
});

router.get('/myself', jwtCheck, async (req, res) => {
  let loggedInUser = await getUserByAuth(req.user);
  let roles = await Settings.getRoles();

  if (loggedInUser && loggedInUser == null) {
    return res.json({
      status: 'error',
      message: responseMessages['notLoggedIn']
    });
  }

  if (loggedInUser && loggedInUser == 'notConfirmed') {
    return res.json({
      status: 'error',
      message: responseMessages['notConfirmed']
    });
  }

  return res.json({
    status: 'success',
    user: loggedInUser
  });
});

router.get('/:id', jwtCheck, async (req, res) => {
  let loggedInUser = await getUserByAuth(req.user);
  let roles = await Settings.getRoles();

  if (loggedInUser && loggedInUser === null) {
    return res.json({
      status: 'error',
      message: responseMessages['notLoggedIn']
    });
  }

  if (loggedInUser && loggedInUser == 'notConfirmed') {
    return res.json({
      status: 'error',
      message: responseMessages['notConfirmed']
    });
  }

  if (!config.checkMongooseID(req.params.id))
    return res.json({
      status: 'error',
      message: responseMessages['wrongData']
    });

  let querriedUser = await User.getUserByRoleAndID('admin', req.params.id);
  if (querriedUser && !_.isEmpty(querriedUser) && querriedUser.role !== roles[0])
    querriedUser = await User.getUserByRoleAndID(querriedUser.role, req.params.id);

  if (loggedInUser.role === roles[0] || loggedInUser._id.equals(querriedUser._id)) {
    return res.json({
      status: 'success',
      user: querriedUser
    });
  } else
    return res.json({
      status: 'error',
      message: responseMessages['unauthorizedAccess']
    });
});

router.put('/delete/:id', jwtCheck, async (req, res) => {
  let loggedInUser = await getUserByAuth(req.user);
  let roles = await Settings.getRoles();
  let result = null;

  if (loggedInUser && loggedInUser === null) {
    return res.json({
      status: 'error',
      message: responseMessages['notLoggedIn']
    });
  }

  if (loggedInUser && loggedInUser == 'notConfirmed') {
    return res.json({
      status: 'error',
      message: responseMessages['notConfirmed']
    });
  }

  if (roles && loggedInUser && loggedInUser.role !== roles[0])
    return res.json({
      status: 'error',
      message: responseMessages['unauthorizedAccess']
    });

  if (!config.checkMongooseID(req.params.id))
    return res.json({
      status: 'error',
      message: responseMessages['wrongData']
    });

  let querriedUser = await User.getUserByRoleAndID('regular', req.params.id);
  if (roles && querriedUser && !_.isEmpty(querriedUser)) {
    if (await deleteUserFromAuth0(querriedUser) === false)
      return res.json({
        status: 'error',
        message: responseMessages['generalError']
      });
  }

  let fields = {
    email: '',
    name: 'anonymous'
  }

  result = await User.updateUserById(querriedUser._id, querriedUser.role, fields);
  if (result != null)
    return res.json({
      status: "success",
      message: responseMessages['success']
    });
  else
    return res.json({
      status: 'error',
      message: responseMessages['generalError']
    });
});

router.post('/', async (req, res) => {
  let fields = req.body;
  let userFieldCheck = await checkUserFields(fields);
  let userFieldContentCheck = await checkUserFieldsContent(fields);

  if (userFieldCheck === false)
    return res.json({
      status: 'error',
      message: responseMessages['notEnoughData']
    });

  if (userFieldContentCheck === false)
    return res.json({
      status: 'error',
      message: responseMessages['wrongData']
    });

  let auth0ID = await signUpToAuth0(fields.email, fields.password);
  if (auth0ID && auth0ID != null) {
    fields = Object.assign(fields, { auth0_id: auth0ID })
  } else {
    return res.json({
      status: 'error',
      message: responseMessages['generalError']
    });
  }

  let newRegular = await User.createRegular(fields);
  if (newRegular && !_.isEmpty(newRegular))
    return res.json({
      status: "success",
      message: responseMessages['success']
    });
  else
    return res.json({
      status: "error",
      message: responseMessages['generalError']
    });
});

module.exports = router;