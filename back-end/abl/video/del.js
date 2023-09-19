async function del(req, res, connection) {

    try {

        let query = req.query.ids;
        if(query == undefined) query = req.body; else query = JSON.parse(query);

        const response = await daoVideoDel.del(query, connection);
        res.json(response);

    } catch (e) {
        res.status(400).send({ errorMessage: e, params: req.body });
    }


}

module.exports = { del } ;