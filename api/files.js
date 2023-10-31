import express from 'express';

const router = express.Router();

import path from 'path';
import mime from 'mime';

import { requireAuth } from '../services/passport-config.js'

import { filesQueries } from '../model/file.js'


router.get('/files/:id', requireAuth, async (req, res, next) => {
    try {
        const fileId = req.params.id;

        let file = await filesQueries.getFileById(fileId)
        console.log(file);
        if(file && file.name && file.storageLink){
            const encodedFilename = encodeURIComponent(file.name);

            const fileExtension = path.extname(file.name);
            const mimeType = mime.getType(fileExtension);

            res.setHeader("Access-Control-Expose-Headers", ["Filename","Mime-Type"]);
            res.setHeader("Filename", encodedFilename);
            res.setHeader("Mime-Type", mimeType);

            const currentDirectory = process.cwd();
            const fullPath = path.join(currentDirectory, file.storageLink);

            res.sendFile(fullPath);
            return;
        }
        console.log(false);
        res.send(false);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});


export default router;