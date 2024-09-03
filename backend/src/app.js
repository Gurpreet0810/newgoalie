import cors from "cors";
import cookieParser from 'cookie-parser';
import express from 'express';


const app = express();


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));


// app.use(express.json({ limit: '20kb' }));
// app.use(express.urlencoded({
//   extended: true,
//   limit: '20kb'
// }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());  // Corrected this line





import userRouter from './routes/route.js'



app.use("/api/v1", userRouter);


export { app };
