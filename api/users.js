import express from 'express';
const router = express.Router();

import { jwtOptions} from '../services/passport-config.js'
import {hashPassword} from '../services/passwordHash.js'

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { userQueries } from '../model/user.js'

router.post('/login', async (req, res, next) => {

    try {
        let { login, password} = req.body

        let user = await userQueries.getUserByLogin(login)

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        bcrypt.compare(password, user.passwordHash, async (err, result) => {
            if (err || !result) {
                return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
            }

            const token = jwt.sign({ id: user.id}, jwtOptions.secretOrKey);
            delete user.passwordHash;
            return res.json({ token: token, user: user });
        });
    } catch (error) {
        console.log(error); next(error); // Pass the error to the error-handling middleware
    }
});


router.post('/users', async (req, res, next) => {
    try {
        let { login, password} = req.body

        let passwordHash = await hashPassword(password)
        let user = await userQueries.addUser(login, passwordHash)
        res.send(user);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

export default router;