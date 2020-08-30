const express = require('express'); //Needed to launch server.
const bodyParser = require('body-parser');
const cors = require('cors'); //Needed to disable sendgrid security.
const sendGrid = require("@sendGrid/mail"); //Access SendGrid library to send emails.
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
const app = express(); //Alias from the express function.

app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change later to only allow our server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/api', (req, res, next) => {
    res.send('API Status: Running');
});

app.post('/api/email', (req, res, next) => {
    console.log(req.body);
    const msg = {
        to: 'dyzhang@gatech.edu',
        from: req.body.email,
        subject: req.body.subject,
        text: req.body.message
    }
    sendGrid.send(msg)
        .then(result => {
            res.status(200).json({
                success: true
            });
        })
        .catch(err => {
            console.log('error: ', err);
            res.status(401).json({
                success: false
            });
        });
});

app.listen(process.env.PORT || 4000);