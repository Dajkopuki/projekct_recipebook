var express = require('express');
var router = express.Router();
var categoryAdd = require('../../abl/category/add');
var categoryList = require('../../abl/category/list')

// Nothing to do if no action is specified.
router.get('/', (req, res) => {
    res.statusCode = 405;
    res.json({"error": 405, "reason": "Action not specified."});
})

// Add a new category.
router.post('/add', (req, res) => {
    if (false !== con_check(res))
    categoryAdd.add(req, res, daoConn.getConnection());
});

router.get('/list', (req, res) => {
    if (false !== con_check(res))
    categoryList.list(req, res);
});

// List categories

/**
 * Make sure we're connected to the database.
 * @param {*} res 
 * @returns 
 */
function con_check(res) {
    let connection = daoConn.getConnection();
    if (connection.readyState === 0 || connection.readyState === 4){
        res.statusCode = 500;
        res.json({"error": "database unavailable"});
        return false;
    }
    return true;
}

module.exports = router;