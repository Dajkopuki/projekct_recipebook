const mongoose = require('mongoose');
const crypto = require("crypto");

const addSchema = mongoose.Schema({
    name: String,
    description: String
    });

const modelAddCategory = mongoose.model("modelAddCategory", addSchema, 'categories');

async function add(add, connection) {
    categoryList = await daoCategoryList.list({});
    currentCategory = categoryList.find(
        (item) => item.name === add.name
      );
    if (currentCategory) {
        throw `category with name ${add.name} already exists in db`;
    }
    const newCategory = new modelAddCategory({
        name: add.name,
        description: add.description      
    });

    // categorylist.push(category);   adds the new item to the list

    newCategory.save()
        .then(savedObject => {
            console.log('Object saved successfully:', savedObject);
        })
        .catch(error => {
            console.error('Error saving object:', error);
        });

    return add;
}


module.exports = { add };