import express from 'express';
import {notifyNewNews} from '../services/socketio.js'
import {scheduleAction} from '../services/schedueAction.js';

const router = express.Router();

import { requireAuth } from '../services/passport-config.js'

import { newsQueries } from '../model/news.js'

router.get('/news', requireAuth, async (req, res, next) => {
    try {
        let result = await newsQueries.getAllNews();
        res.send(result);
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});

router.post('/news', requireAuth, async (req, res, next) => {
    let creator_id, title, content, publicationDate;

    try {
        ({ creator_id, content, publicationDate, title} = req.body
            || 
        (() => { throw new Error('Missing required properties in req.body'); })());
    }
    catch (error){
        return res.status(400).json({ message: error });
    }

    try {
        scheduleAction(publicationDate, async () => {
            let result = await newsQueries.addNews(creator_id, title, content, publicationDate)
            notifyNewNews()
        })
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
});


router.put('/news/:id', requireAuth, async (req, res, next) => {
    const id = req.params.id;

    let creator_id, title, content, publicationDate;
    try {
        ({ creator_id, content, publicationDate, title} = req.body)
        const existingProps = { creator_id, content, publicationDate, title };
    }
    catch (error){
        return res.status(400).json({ message: error });
    }
    
    try {
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