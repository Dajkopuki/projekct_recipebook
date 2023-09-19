/**
 * Get list of videos according to request conditions or all videos
 * if no conditions are set.
 * @param {*} req Request body
 * @param {*} res Response body
 * @param {*} connection Mongoose connection
 * @param {*} videoSchema Video schema for optional output comparison
 * @returns void
 */
async function search(req, res, connection, videoSchema) {
    let response = { "error": 400, "reason": "Invalid request." };
    res.statusCode = 400;
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.set('Access-Control-Allow-Headers', '*');
    try {
        const valid = ajv.validate(daoConn.getSearchSchema(), req.body);
        if (!valid) {
            res.json(response);
            return;
        }
        if (Object.getOwnPropertyNames(req.body).length > 8) {
            response = {"error": 413, "reason": "Request too big."};
            res.statusCode = 413;
            res.json(response);
            return;
        }
        response = await daoVideoSearch.search(req.body, connection);
        if (response.length === 0) {
            res.statusCode = 404;
            response = {"error": 404, "reason": "No data found."};
            res.json(response);
            return;
        }
        if (response === false) {
            res.statusCode = 503;
            response = {"error": 503, "reason": "Database failed."};
            res.json(response);
            return;
        }
    } catch (e) {
        console.error("Database query failed with " + e);
        res.statusCode = 505;
        response = { "error": 505, "reason": "Database query failed." };
        res.json(response);
        return;
    }
    res.statusCode = 200;
    res.json(response);
};

module.exports = { search };