async function list(req, res, connection) {
    let response = { "error": 405, "reason": "Invalid request." };
    res.statusCode = 405;
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.set('Access-Control-Allow-Headers', '*');
    try {
        if (Object.getOwnPropertyNames(req.body).length > 3) {
            response = {"error": 406, "reason": "request too big"};
            res.statusCode = 406;
            res.json(response);
            return;
        }
        response = await daoCategoryList.list(connection);
        if (response.length === 0) {
            res.statusCode = 407;
            response = {"error": 407, "reason": "No data found."};
            res.json(response);
            return;
        }
        if (response === false) {
            res.statusCode = 505;
            response = {"error": 505, "reason": "Database failed."};
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
module.exports = { list }