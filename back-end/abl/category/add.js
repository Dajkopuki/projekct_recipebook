async function add(req, res, connection) {
    const addCategorySchema = {
        type: 'object',
        properties: {
           name: { type: 'string', minLength: 1, maxLength: 200 },
           description: { type: 'string', minLength: 1, maxLength: 3000 }
        }
     };

    let response = { "error": 400, "reason": "Invalid Request" };
    res.statusCode = 400;
    console.log(req.body);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.set('Access-Control-Allow-Headers', '*');
    try {
        const valid = ajv.validate(addCategorySchema, req.body);
        if (!valid) {
            res.json(response);
            return;
        }
        if (Object.getOwnPropertyNames(req.body).length > 2) {
            response = {"error": 413, "reason": "Request Entity Too Large"};
            res.statusCode = 413;
            res.json(response);
            return;
        }
        response = await daoCategoryAdd.add(req.body, connection);
        console.error("database");
        if (response === false) {
            res.statusCode = 503;
            response = {"error": 503, "reason": "Database Failed"};
            res.json(response);
            return;
        }
    } catch (e) {
        console.error("Database query failed with " + e);
        res.statusCode = 505;
        response = { "error": 505, "reason": e };
        res.json(response);
        return;
    }
    res.statusCode = 200;
    res.json(response);
};

module.exports = { add };