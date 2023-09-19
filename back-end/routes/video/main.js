var express = require('express');
var router = express.Router();

const videoShow = require('../../abl/video/show');
const videoAdd = require('../../abl/video/add');
const videoDel = require('../../abl/video/del');
const videoSearch = require('../../abl/video/search');
const videoUpdate = require('../../abl/video/update');
const { daoConnect } = require('../../dao/connect');

// Nothing to do if no action is speciifed.
router.get('/', (req, res) => {
    res.statusCode = 405;
    res.json({"error": 405, "reason": "No action specified"});
});

// Add new video.
router.post('/add', (req, res) => {
    if (false !== con_check(res))
    videoAdd.add(req, res, daoConn.getConnection(), daoConn.getVideoSchema(), daoConn.getCategorySchema());
});

// Delete video.
router.get('/delete', (req, res) => {
    if (false !== con_check(res))
    videoDel.del(req, res, daoConn.getConnection(), daoConn.getVideoSchema(), daoConn.getCategorySchema());
});

// Search for / filter videos
router.get('/search', (req, res) => {
    if (false !== con_check(res))
    videoSearch.search(req, res, daoConn.getConnection(), daoConn.getVideoSchema(), daoConn.getCategorySchema());
});
router.options('/search', (req, res) => {
    if (false !== con_check(res))
    videoSearch.search(req, res, daoConn.getConnection(), daoConn.getVideoSchema(), daoConn.getCategorySchema());
});

// Update video.
router.post('/update', (req, res) => {
    if (false !== con_check(res))
    videoUpdate.update(req, res, daoConn.getConnection(), daoConn.getVideoSchema(), daoConn.getCategorySchema());
})
/**
 * Make sure we're connected to the database.
 * @param {*} res Express response object
 * @returns boolean
 */
function con_check(res) {
    let connection = daoConn.getConnection();
    if (connection.readyState === 0 || connection.readyState === 4){
        res.statusCode = 500;
        res.json({"dberror": "database unavailable"});
        return false;
    }
    return true;
}

module.exports = router;