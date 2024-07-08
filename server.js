const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const firebaseService = require('./firebaseService');
const admin = require('firebase-admin'); // Make sure you import admin

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to match your frontend's origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Handle GET requests to the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Push Notification Service');
});

app.post('/subscribe', (req, res) => {
  const { token } = req.body;
  firebaseService.saveUserToken(token)
    .then(() => res.status(200).send('Token saved successfully'))
    .catch((error) => {
      console.error('Error saving token:', error); // Log the error
      res.status(500).send('Error saving token: ' + error);
    });
});

app.post('/sendNotification', async (req, res) => {
  const { title, message, link, image } = req.body;
  try {
    const tokens = await firebaseService.getUserTokens();
    const payload = {
      notification: {
        title,
        body: message,
        ...(link && { click_action: link }),
        ...(image && { image })
      }
    };
    const response = await admin.messaging().sendToDevice(tokens, payload);
    console.log('Firebase response:', response); // Log the response here
    res.status(200).send('Notifications sent successfully');
  } catch (error) {
    console.error('Error sending notifications:', error); // Log the error
    res.status(500).send('Error sending notifications: ' + error);
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
