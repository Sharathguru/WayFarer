import express from 'express';
import { login, register } from '../controllers/auth.controllers.js';
import validate from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

let router=express.Router();


router.post("/register",validate(registerSchema),register)
router.post("/login",validate(loginSchema),login)


export default router;