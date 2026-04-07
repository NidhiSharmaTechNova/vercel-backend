import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectdb from './config/mongodb.js';
import authRouter from "./routes/authRoutes.js"
import userRouter from './routes/userRoutes.js';


const app = express();
const port = process.env.PORT || 4000;
connectdb();

// const allowedOrigins = ['https://vercel-frontend-three-olive.vercel.app']

app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//   origin: true,
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://vercel-frontend-three-olive.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.get('/',(req, res)=>{
   res.send('API working fine')
})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port,()=> console.log(`server started on port ${port}`));
