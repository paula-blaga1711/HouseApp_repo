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
})

module.exports = router;