import express from 'express';
import {notifyNewNews} from '../services/socketio.js'
import {scheduleAction} from '../services/schedueAction.js';

const router = express.Router();

import { requireAuth } from '../services/passport-config.js'

import { newsQueries } from '../model/news.js'
import { filesQueries } from '../model/file.js'

router.get('/news', requireAuth, async (req, res, next) => {
    try {
        let result = await newsQueries.getAllNews();
        res.send(result);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

router.post('/news', requireAuth, async (req, res, next) => {
    try {
        let {creator_id, title, htmlContent, content, publicationDate} = req.body;
        scheduleAction(publicationDate, async () => {
            let news = await newsQueries.addNews(creator_id, title, content, htmlContent, publicationDate)
            let file = await filesQueries.addFile("","");
            let fileId = file.id;
            await newsQueries.addFileIdToNews(news.id, fileId);
            notifyNewNews()
        })
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});


router.put('/news/:id', requireAuth, async (req, res, next) => {
    const id = req.params.id;

    try {
        let { creator_id, content, htmlContent, publicationDate, title } = req.body
        let existingProps = { creator_id, content, htmlContent, publicationDate, title }
    
        let result = await newsQueries.updateNews(id, existingProps);

        res.send(result);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
})

router.delete('/news/:id', requireAuth, async (req, res, next) => {
    try {
        const id = req.params.id;

        let result = await newsQueries.removeNews(id);

        res.send(result);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

export default router;