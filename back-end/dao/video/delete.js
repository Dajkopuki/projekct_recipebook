const mongoose = require("mongoose");
const { Schema } = mongoose;

const deleteSchema = new Schema({});
deleteSchema.path('_id');

const Model = mongoose.models["Model"] || mongoose.model("Model", deleteSchema, "videos");

async function del({ids}, conn) {
    let response= [];

    // let docIDs = await JSON.parse(JSON.stringify(ids));


    await Model.deleteMany({ _id: { $in: ids } })
        .then(result => {

            if (result.deletedCount > 0) {
                response = "objekt byl vymazán";
            } else {
                response = "Dokument/y nebyly nalezeny ";
            }
        })
        .catch(err => {
            console.error(err);
            return Promise.reject(err);
        });

    return response;

}

module.exports = { del };