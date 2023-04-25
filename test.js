const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
const itemsSchema = new mongoose.Schema({
    itemName: String
})

const listsSchema = new mongoose.Schema({
    listName :String,
    items:[itemsSchema]
});
const Items = mongoose.model("defaults",itemsSchema);
const Lists = mongoose.model("customs",listsSchema);

const item1 = new Items({itemName: "Yess sir"})
const item2 = new Items({itemName: "Oh yeah sir"})
const item3 = new Items({itemName: "asalule"})

const newList = new Lists({
    listName: "try",
    items:[item1,item2,item3]
})
//newList.save();

Lists.findOne({listName:"try"}).then(function(foundLists){
    console.log(foundLists);
})