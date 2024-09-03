
import userRouter from './routes/route.js';
import dotenv from 'dotenv'
import { app } from './app.js';
import { connectDb } from './db/db.js';


dotenv.config({
  path: './env'
});


app.use(userRouter);


connectDb()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log('Server is running at port: ', process.env.PORT || 4000);
    });
  })
  .catch((error) => {
    console.log('MongoDB connection failed!!', error);
  });
