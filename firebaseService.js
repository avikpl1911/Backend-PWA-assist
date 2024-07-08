require('dotenv').config();

const admin = require('firebase-admin');



if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail:process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
  }

const db = admin.firestore();

async function saveUserToken(token) {
  try {
    const docRef = db.collection('tokens').doc(token);
    await docRef.set({ token });
    console.log(`Token ${token} saved successfully`);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
}

async function getUserTokens() {
  try {
    const tokensSnapshot = await db.collection('tokens').get();
    const tokens = [];
    tokensSnapshot.forEach(doc => tokens.push(doc.id));
    console.log('Retrieved tokens:', tokens);
    return tokens;
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    throw error;
  }
}


module.exports = {
  saveUserToken,
  getUserTokens
};
