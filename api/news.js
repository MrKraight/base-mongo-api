import express from 'express';
import {notifyNewNews} from '../services/socketio.js'
import {scheduleAction} from '../services/schedueAction.js';

import multer from 'multer';

const router = express.Router();

import { requireAuth } from '../services/passport-config.js'

import filesystem from '../services/filesystem.js';

import fs from 'fs';
import path from 'path';

import { newsQueries } from '../model/news.js'
import { filesQueries } from '../model/file.js'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = `temp`;
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
        cb(null, `${file.originalname}`);
    },
    overwrite: true
});

// Initialize Multer uploader
const upload = multer({ storage: storage });

router.get('/news', requireAuth, async (req, res, next) => {
    try {
        let result = await newsQueries.getAllNews();
        res.send(result);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

router.post('/news', requireAuth, upload.single('file'), async (req, res, next) => {
    try {
        console.log('req.body',JSON.parse(req.body.news))
        console.log('req.file',req.file)
    
        let {creator_id, title, htmlContent, content, publicationDate } = JSON.parse(req.body.news);    

        scheduleAction(publicationDate, async () => {
            let news = await newsQueries.addNews(creator_id, title, content, htmlContent, publicationDate)
            if (req.file){
                console.log(req.file.originalname)
                let fileName = req.file.originalname;
                let file = await filesQueries.addFile("","");
                let fileId = file._id;

                const fileExtension = path.extname(fileName);

                fs.rename(`temp/${fileName}`, `files/${fileId}${fileExtension}`, (err) => {
                    if (err) {
                        console.error(`Error moving the file: ${err}`);
                    } else {
                        console.log('File moved successfully.');
                    }
                });

                await newsQueries.updateNews(news.id, {file: fileId});

                let obj = { storageLink: `files/${fileId}${fileExtension}`, name: fileName }
                await filesQueries.updateFile(fileId, obj);
            }
            
            notifyNewNews()
        })
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});


router.put('/news/:id', requireAuth, upload.single('file'), async (req, res, next) => {
    const id = req.params.id;

    try {
        console.log('req.body',JSON.parse(req.body.news))
        console.log('req.file',req.file)

        let  {creator_id, content, htmlContent, publicationDate, title}  = JSON.parse(req.body.news);
        let existingProps = { creator_id, content, htmlContent, publicationDate, title }

        let news = await newsQueries.getNewsById(id);

        if (req.file){
            let fileId = null;
            const fileExtension = path.extname(req.file.originalname);
            if(news?.file){
                let file = await filesQueries.getFileById(news?.file)
                fileId = file._id.toString();
                let localFileExtension = path.extname(file.name);
                filesystem.removeFile(`files/${file._id.toString()}${localFileExtension}`)
            }else{
                let file = await filesQueries.addFile("","");
                fileId = file._id.toString();
            }

            fs.rename(`temp/${req.file.originalname}`, `files/${fileId}${fileExtension}`, (err) => {
                if (err) {
                    console.error(`Error moving the file: ${err}`);
                } else {
                    console.log('File moved successfully.');
                }
            });

            await newsQueries.updateNews(news.id, {file: fileId});

            let obj = { storageLink: `files/${fileId}${fileExtension}`, name: req.file.originalname }
            await filesQueries.updateFile(fileId, obj);
        }
    
        let result = await newsQueries.updateNews(id, existingProps);

        res.send(result);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
})

router.delete('/news/:id', requireAuth, async (req, res, next) => {
    try {
        const id = req.params.id;

        let news = await newsQueries.getNewsById(id);

        console.log(news);

        if(news?.file){
            let file = await filesQueries.getFileById(news?.file)
            let localFileExtension = path.extname(file.name);
            filesystem.removeFile(`files/${file._id.toString()}${localFileExtension}`)
        }

        let result = await newsQueries.removeNews(id);

        res.send(result);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

router.delete('/news/:id/files', requireAuth, async (req, res, next) => {
    console.log('trying to delete file');
    try {
        const newsId = req.params.id;
        let news = await newsQueries.getNewsById(newsId);
        console.log('news.file',news.file);

        if(news?.file?._id){
            let file = await filesQueries.getFileById(news?.file?._id)
            const fileExtension = path.extname(file.name);
            filesystem.removeFile(`files/${file._id.toString()}${fileExtension}`)
            await filesQueries.removeFile(file._id);
            await newsQueries.updateNews(newsId, {file: null});

            res.send(true);
            return;
        }

        res.send(false);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

export default router;