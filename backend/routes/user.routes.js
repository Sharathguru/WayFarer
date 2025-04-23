import express from 'express';
import { getUsers } from '../controllers/user.controllers.js';
import auth from '../middlewares/auth.js';

let router=express.Router();


router.get("/",auth,getUsers)


export default router;