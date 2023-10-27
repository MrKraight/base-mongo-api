import express from 'express';
import cors from 'cors';
import http from 'http';
import bodyParser from 'body-parser';

import { passport } from './services/passport-config.js'

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: '*'
}));

import { initializeRoutes } from './services/expressRoutes.js';
initializeRoutes(app);

const server = http.createServer(app);

import {mongoConnect} from './services/mongoose.js'
mongoConnect();

import dotenv from 'dotenv';
dotenv.config();
const appPort = process.env.APP_PORT;

import { initialize } from './services/socketio.js';
initialize(server)


server.listen(appPort, () => {
  console.log(`Example app listening on port ${appPort}`)
})
