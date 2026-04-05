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
// app.use(cors({origin: allowedOrigins , credentials: true}));
app.use(cors({
  allowedOrigins: [
    "http://localhost:5173",
    "https://vercel-frontend-three-olive.vercel.app"
  ],
  credentials: true
}));

app.get('/',(req, res)=>{
   res.send('API woring fine')
})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port,()=> console.log(`server started on port ${port}`));
