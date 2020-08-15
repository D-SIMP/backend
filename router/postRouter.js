const express = require('express');
const router = express.Router();
const { postController } = require('../controller');

const {
    allPosts,
    postsById,
    uploadPost,
    editPost,
    deletePost,
    clearPosts,
} = postController;

router.get('/all', allPosts);
router.get('/user/:id', postsById);
router.post('/upload/:id', uploadPost);
router.patch('/edit/:id', editPost);
router.delete('/delete/:id', deletePost);
router.delete('/clear', clearPosts);

module.exports = router;
