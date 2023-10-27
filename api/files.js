import express from 'express';

const router = express.Router();

import fs from 'fs';
import multer from 'multer';
import path from 'path';

import filesystem from '../services/filesystem.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = `files`;
        // Set destination folder based on request ID
        if (file) {
            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        console.log(file);
        const fileExtension = path.extname(file.originalname);
        // Use original file name as filename
        cb(null, `${req.params.id}${fileExtension}`);
    },
    overwrite: true
});

// Initialize Multer uploader
const upload = multer({ storage: storage });

import { requireAuth } from '../services/passport-config.js'

import { filesQueries } from '../model/file.js'

router.post('/files/:id', requireAuth, upload.single('file'), async (req, res, next) => {
    try { 
        const fileId = req.params.id;
        console.log('fileId',fileId);      
        if (req.file) {
            let file = filesQueries.getFileById(fileId)

            if(file && file.name){
                const fileExtension = path.extname(file.name);
                filesystem.removeFile(`/files/${fileId}${fileExtension}`)
            }

            const fileExtension = path.extname(req.file.filename);
            let obj = { storageLink: `files/${fileId}${fileExtension}`, name: req.file.filename }
            await filesQueries.updateFile(fileId, obj);
        }
        else{
            res.send(false);
        }

        res.send(true);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});


router.get('/files/:id', requireAuth, async (req, res, next) => {
    try {
        const fileId = req.params.id;

        let file = await filesQueries.getFileById(fileId)
        console.log(file);
        if(file && file.name){
            const fileExtension = path.extname(file.name);

            const fileBuffer = filesystem.getFileBuffer(`${file.storageLink}`);
            console.log(`${file.storageLink}/files/${fileId}${fileExtension}`);
            console.log('fileBuffer',fileBuffer);

            res.setHeader('Content-Disposition', 'attachment; filename="yourfile.txt"');
            res.setHeader('Content-Type', 'application/octet-stream');
            console.log('headers success')
            res.send(fileBuffer);
            return;
        }
        console.log(false);
        res.send(false);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

router.delete('/files/:id', requireAuth, async (req, res, next) => {
    try {
        const fileId = req.params.id;

        let file = filesQueries.getFileById(fileId)

        if(file && file.name){
            const fileExtension = path.extname(file.name);
            filesystem.removeFile(`${file.storageLink}`)
        }

        await filesQueries.updateFile(fileId, { storageLink: "", name: "" });

        res.send(true);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

export default router;