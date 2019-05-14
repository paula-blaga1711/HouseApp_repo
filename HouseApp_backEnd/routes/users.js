const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const Settings = require('../models/setting');

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

module.exports = router;
