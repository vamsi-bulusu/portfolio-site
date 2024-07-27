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
  
    // Basic validation
    if (!name || !subject || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
  
    const request = mailjetClient
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'bulusu.vk08@gmail.com',
              Name: 'Vamsi Krishna',
            },
            To: [
              {
                Email: 'bulusu.vk08@gmail.com',
                Name: 'Vamsi Krishna',
              },
            ],
            Subject: subject,
            TextPart: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          },
        ],
      });
  
    request
      .then((result) => {
        res.status(200).json({ message: 'Email sent!' });
      })
      .catch((err) => {
        console.error('Error:', err);
        res.status(500).json({ message: 'Error sending email' });
      });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
