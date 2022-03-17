import express from "express"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const bodyParser = require('body-parser')
import {createSignIn, createUser, transfer} from "../controller/user.js";

import { isAuthenticated } from "../services/auth.js";
const router = express.Router()
router.use(bodyParser.json()) // for parsing application/json

router.post("/signup", createUser);
router.post("/signin", createSignIn);
router.post("/transferAmount",transfer);

export default router;