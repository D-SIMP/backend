const { db } = require('../database');
const { createJWTToken } = require('../helper/jwt');
const hash = require('../helper/hash');
const { transporter } = require('../helper/nodemailer');

module.exports = {
    Accounts: (req,res) => {
        let get = `SELECT * FROM users`;
        db.query(get, (err,result) => {
            if (err) {
                res.status(500).send(err.message);
            }
            res.status(200).send({
                status: `Success`,
                data: result,
                message: `All Accounts is Fetched`,
            });
        });
    },
    Register: (req,res) => {
        let { username, password, email } = req.body;
        let register = `INSERT INTO users (username, password, email) VALUES ('${username}', '${hash(password)}', '${email}')`;
        db.query(register, (err,insert) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                let get = `SELECT * FROM users WHERE userid = ${insert.insertId}`;
                db.query(get, (err,result) => {
                    if (err) {
                        res.status(500).send({
                            status: `Failed`,
                            message: err.message,
                        });
                    }
                    let { username, password, email } = result[0];
                    let url = `http://localhost:3000/verify?username${username}&password=${password}`;
                    let mailOptions = {
                        from: `Admin <aldrich.neil.hung@gmail.com>`,
                        to: email,
                        subject: `Account Verification`,
                        html: `<p>Click <a href="${url}">here</a> to verify your account</p>`,
                    };
                    transporter.sendMail(mailOptions, (err,result) => {
                        if (err) {
                            res.status(500).send(err.message);
                        }
                        let token = createJWTToken({...result[0]});
                        res.status(200).send({
                            status: `Success`,
                            data: {
                                ...result[0],
                                token,
                            },
                            message: `Account Created`,
                        });
                    });
                });
            }
        });
    },
    Login: (req,res) => {
        let { username, password } = req.body;
        let login = `SELECT * FROM users WHERE username = '${username}' AND password = '${hash(password)}'`;
        db.query(login, (err,result) => {
            if (err) {
                res.status(500).send(err.message);
            }
            if (result.length !== 0) {
                let token = createJWTToken({...result[0]});
                res.status(200).send({
                    status: `Success`,
                    data: {
                        ...result[0],
                        token,
                    },
                    message: `Login Successful`,
                });
            } else {
                res.status(404).send({
                    status: 'Not Found',
                    message: 'User Not Found',
                });
            }
        });
    },
    KeepLogin: async (req,res) => {
        let { id } = req.user;
        let user = `SELECT * FROM users WHERE userid = ${id}`;
        let response = await query(user);
        let token = createJWTToken({...response[0]});
        res.status(200).send({
            status : 'Success',
            data : {
                ...response[0],
                token,
            },
            message : 'Authorized',
        });
    },
    Verification: (req,res) => {
        let { username, password } = req.body;
        let verif = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        db.query(verif, (err,results) => {
            if (err) {
                res.status(500).send(err.message);
            }
            if (results.length !== 0) {
                let setVerif = `UPDATE users SET verified = 1 WHERE userid = ${results[0].id}`;
                db.query(setVerif, (err,update) => {
                    if (err) {
                        res.status(500).send(err.message);
                    }
                    res.status(200).send({
                        status : 'Updated',
                        data : true,
                        message : 'User Verified',
                    });
                });
            } else {
                res.status(404).send('User Not Found');
            }
        });
    },
    ChangePassword: async (req,res) => {
        try {
            let { id } = req.user;
            let { oldPass, newPass } = req.body;
            let get = `SELECT * FROM users WHERE userid = ${id} AND password = '${hash(oldPass)}'`;
            let response = await query(get);
            if (response.length !== 0) {
                let update = `UPDATE users SET password = '${hash(newPass)}' WHERE userid = ${id}`;
                await query(update);
                let results = await query(`SELECt * FROM users WHERE userid = ${id}`);
                let token = createJWTToken({...results[0]});
                res.status(200).send({
                    status: 'Edited',
                    token,
                    message: 'Edit Successful',
                });
            } else {
                return res.status(404).send({
                    status: 'Not Found',
                    message: 'Invalid Password',
                });
            }
        } catch (err) {
            return res.status(500).send({
                status: 'Server Error',
                message: err.message,
            });
        }
    },
};
