let mongoose = require('mongoose');
let searchSchema = mongoose.Schema({
    title: String,
    description: String,
    categories: [Object],
    keywords: [String],        
    author: String,
    license: String,
    duration: Number,
    created: String,
    added: String,
    modified: String,
    link: String,
    mutation: Object
    });

let model = mongoose.model("model", searchSchema, 'videos');
/**
 * Seach for videos.
 * @param {*} searchFor 
 * @param {*} connection 
 */
async function search(searchFor, connection) {
    let response = [];
    let query = queryAssembly(searchFor);
    let found;
    if (query.length === 0) {
        found = await model.find({}).exec();
    } else {
        found = await model.find({$and: query}).exec();
    }
    if (!found) {
        console.error("Looking for " + searchFor + "but didn't find anything.");
        throw found;
    }
    if (found.length !== 0) {
        response = found;
    }
    if (found === null) {
        response = false;
    }
    return response;
};

/**
 * Assemble database query from request body.
 * @param Object reqBody Request body
 * @returns Query for the database.
 */
function queryAssembly(reqBody) {
    let query = [];
    let tmp = [];
    Object.getOwnPropertyNames(reqBody).forEach((key) => {
        switch (key) {
            default:
                query.push({[key]: {$regex: reqBody[key]}});
                break;
            case "keywords":
                query.push({[key]: {$all: reqBody[key]}});
                break;
            case "languageDabing":
                for (let i = 0; i < reqBody[key].length; i++) {
                    reqBody[key][i] = reqBody[key][i].toUpperCase();
                }
                tmp.push({"mutation.dabing": {$all: reqBody[key]}});
                break;
            case "languageSubtitles":
                for (let i = 0; i < reqBody[key].length; i++) {
                    reqBody[key][i] = reqBody[key][i].toUpperCase();
                }
                tmp.push({"mutation.subtitles": {$all: reqBody[key]}});
                break;
            case "categories":
                reqBody[key].forEach((cId) => {
                    query.push({"categories.id": cId});
                });
                break;
            case "createdStart":
                if (reqBody.hasOwnProperty("createdStop")) {
                    query.push({$and: [{"created": {$gte: reqBody[key]}}, {"created": {$lte: reqBody["createdStop"]}}]});
                } else {
                    query.push({"created": {$gte: reqBody[key]}});
                }
                break;
            case "createdStop":
                if (!reqBody.hasOwnProperty("createdStart")) {
                    query.push({"created": {$lte: reqBody[key]}});
                }
                break;
            case "link":
                query.push({"link": reqBody[key]});
                break;
        }
        if (tmp.length > 0) {
            query.push({$and: tmp});
        }
    });
    return query;
}

module.exports = { search };