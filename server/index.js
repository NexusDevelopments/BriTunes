import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('BriTunes API is running!');
});

// Placeholder for user, music, and follow endpoints

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`BriTunes server running on port ${PORT}`);
});
