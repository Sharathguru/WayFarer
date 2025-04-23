import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import db from './config/db.js';
db();


let app=express();





export default app;