let mongoose = require('mongoose');
let catSchema = mongoose.Schema({
    name: String,
    descriotion: String
    });

let modelCaterory = mongoose.model("modelCaterory", catSchema, 'categories');

/**
 * Get list of all categories
 * @param {*} connection Mongoose DB connection
 * @returns 
 */
async function list(connection) {
    let response = [];
    let found = await modelCaterory.find({}).exec();
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

module.exports = { list };