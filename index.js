const express = require('express');
const app = express();
const port = process.env.PORT || 2000;
const cors = require('cors');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { transportAwait } = require('./helper/nodemailer');

app.use(cors());
app.use(bearerToken());
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res) => {
    res.status(200).send(`<h1>HI SIMP!</h1>`);
});

let userCount = 0;
app.io = io;
app.userCount = userCount;

app.get('/', (req,res) => {
    res.status(200).send('<h1>Welcome to Todo API</h1>');
});

io.on('connect', (socket) => {
    userCount+=1;
    console.log('User Connected : ', userCount);
    io.emit('Connected', userCount);
    socket.on('disconnect', () => {
        userCount-=1;
        console.log('User Disconnected : ', userCount);
        io.emit('Connectedconst { ', userCount);
    });
});

app.post('/send-mail', async (req,res) => {
    let to = req.query.email;
    let mailOptions = {
        from : 'Admin <admin@todo.com>',
        to,
        subject : 'Testing Nodemailer',
        html : '<h1>Success</h1>'
    };
    if (to) {
        try{
            await transportAwait(mailOptions);
            res.status(200).send('Email Send');
        } catch {
            res.status(500).send(err.message);
        }
    } else {
        res.status(404).send('Email Not Found');
    }
});

const {
    authRouter,
} = require('./router');

app.use('/auth', authRouter);

app.listen(port, () => console.log(`API active at port ${port}`));
