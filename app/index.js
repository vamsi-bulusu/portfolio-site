require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mailjet = require('node-mailjet');

const app = express();
const PORT = process.env.PORT || 3000;

// Set your Mailjet API credentials
const mailjetClient = mailjet.apiConnect(process.env.API_KEY, process.env.SECRET);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));



app.post('/send-email', (req, res) => {
    const { name, subject, email, message } = req.body;

    const request = mailjetClient
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": `bulusu.vk08@gmail.com`,
                        "Name":  `Vamsi Krishna`
                    },
                    "To": [
                        {
                            "Email": "bulusu.vk08@gmail.com",
                            "Name": "Vamsi Krishna"
                        }
                    ],
                    "Subject": `${subject}`,
                    "TextPart": `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                }
            ]
        });

    request
        .then((result) => {
            res.status(200).redirect('/');
        })
        .catch((err) => {
            console.error(err.statusCode);
            res.status(500).send('Error sending email');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
