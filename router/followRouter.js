const express = require('express');
const router = express.Router();
const { followController } = require('../controller');

const {
    getFollowers,
    addFollower,
    followersPerUser,
} = followController;

router.get('/get', getFollowers);
router.post('/add/:userid', addFollower);
router.get('/user/:userid', followersPerUser);

module.exports = router;
