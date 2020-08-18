const { query } = require('../database');
const moment = require('moment');

module.exports = {
    getFollowers: async (req,res) => {
        let get = `SELECT * FROM follow`;
        await query(get, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: 'Success',
                data: results,
                message: 'Follow fetched successfully',
            });
        });
    },
    addFollower: async (req,res) => {
        let { userid } = req.params;
        let { followid } = req.body;
        let time = moment().format('LT');
        let start = moment().startOf(`${time}`).fromNow();
        let add = `INSERT INTO follow (userid, followid, followfrom) VALUES (${userid}, ${followid}, '${start}')`;
        await query(add, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: 'Success',
                data: results,
                message: 'Add Successful',
            });
        });
    },
    followersPerUser: async (req,res) => {
        let { userid } = req.params;
        let get = `SELECT * FROM follow WHERE userid = ${userid}`;
        await query(get, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: 'Success',
                data: results,
                message: `Followers of id ${userid} fetched successfully`,
            });
        });
    },
};
