const { db } = require('../database');
const { uploader } = require('../helper/multer');
const moment = require('moment');
const fs = require('fs');

module.exports = {
    allPosts: (req,res) => {
        let get = `SELECT * FROM posts`;
        db.query(get, (err,result) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: `Success`,
                data: result,
                message: `All posts fetched`,
            });
        });
    },
    postsTab: (req,res) => {
        let { id } = req.params;
        let get = `SELECT * FROM posts WHERE author = ${id}`;
        db.query(get, (err,result) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: `Success`,
                data: result,
                message: `Posts fetched`,
            });
        });
    },
    postPerId: (req,res) => {
        let { author, postid } = req.params;
        let get = `SELECT * FROM posts WHERE author = ${author} AND postid = ${postid}`;
        db.query(get, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: `Success`,
                data: results,
                message: `Fetch Successful`,
            });
        });
    },
    uploadPost: (req,res) => {
        try {
            let { id } = req.params;
            const path = '/images';
            const upload = uploader(path, 'SIMP').fields([{ name:'image' }]);
            upload(req,res, async (err) => {
                if (err) {
                    res.status(500).send(err.message);
                }
                let { caption } = req.body;
                let { image } = req.files;
                const imagePath = image ? `${path}/${image[0].filename}` : null;
                let time = moment().format('LT');
                let created = moment().startOf(`${time}`).fromNow();
                let uploadQuery = `INSERT INTO posts (caption, createdAt, author, imageURL) VALUES ('${caption}', '${created}', '${id}', '${imagePath}')`;
                db.query(uploadQuery, (err,results) => {
                    if (err) {
                        fs.unlinkSync(`./public${imagePath}`);
                        return res.status(500).send(err.message);
                    }
                    res.status(200).send({
                        status: 'Success',
                        data: results,
                        message: 'Upload Successful',
                    });
                });
            });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    },
    editPost: (req,res) => {
        let { author, postid } = req.params;
        let select = `SELECT * FROM posts WHERE author = ${author} AND postid = ${postid}`;
        db.query(select, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            let oldImagePath = results[0].imageURL;
            try {
                const path = `/images`;
                const upload = uploader(path, `SIMP`).fields([{ name:'image' }]);
                upload(req,res,(err) => {
                    if (err) {
                        res.status(500).send(err.message);
                    }
                    const { caption } = req.body;
                    const { image } = req.files;
                    const imagePath = image ? `${path}/${image[0].filename}` : oldImagePath;
                    let updateQuery = `UPDATE posts SET caption = '${caption}' WHERE postid = ${id}`;
                    db.query(updateQuery, (err,results) => {
                        if (err) {
                            fs.unlinkSync(`./public${imagePath}`);
                            res.status(500).send(err.message);
                        }
                        if (image) {
                            fs.unlinkSync(`./public${oldImagePath}`);
                        }
                        res.status(200).send({
                            status: 'Success',
                            data: results,
                            message: 'Edit Successful',
                        });
                    });
                });
            } catch (err) {
                res.status(500).send(err.message);
            }
        });
    },
    deletePost: (req,res) => {
        let { id } = req.params;
        let deleteQuery = `DELETE FROM posts WHERE postid = ${id}`;
        db.query(deleteQuery, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: 'Success',
                data: results,
                message: 'Deleted Successfully',
            });
        });
    },
    clearPosts: (req,res) => {
        let truncate = `TRUNCATE TABLE posts`;
        db.query(truncate, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: 'Success',
                data: results,
                message: 'Truncate Successful',
            });
        });
    },
};
