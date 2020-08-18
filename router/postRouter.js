const express = require('express');
const router = express.Router();
const { postController } = require('../controller');

const {
    allPosts,
    postsTab,
    postPerId,
    uploadPost,
    editPost,
    deletePost,
    clearPosts,
} = postController;

router.get('/all', allPosts);
router.get('/user-tab/:id', postsTab);
router.get('/user/:author/:postid', postPerId);
router.post('/upload/:id', uploadPost);
router.post('/edit/:author/:postid', editPost);
router.post('/delete/:id', deletePost);
router.post('/clear', clearPosts);

module.exports = router;
