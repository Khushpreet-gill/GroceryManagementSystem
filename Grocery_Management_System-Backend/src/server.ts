import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;


mongoose.connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });

  
