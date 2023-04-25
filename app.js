//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname +"/date.js");

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))


mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");
const listsSChema = new mongoose.Schema({
    item:String
});

const Items = mongoose.model("defaults",listsSChema);


const firstItem = new Items({item: "This is a default"});
const secondItem = new Items({item: "list"}); 
const thirdItem = new Items({item: "for you"});


app.get("/", async function (req, res) {  
    var lists = [];
    await Items.find({}).then(function(items){
        lists = items;
    })
    let day = date.getDay();
    res.render("list", {
        kindOfDay: day,
        myLists: lists
    });

    
    
});


app.post("/",function(req,res){
    let input = req.body.newInput;
    const newItem = new Items({
        item: input
    })
    newItem.save();
    res.redirect("/");
});

app.post("/delete",async function(req,res){
    const target = req.body.checkbox;
    console.log(target);
    await Items.findByIdAndDelete(target)

    res.redirect("/");
});



app.get("/about", function(req,res){
    res.render("about");
})



app.listen(3000, function () {
    console.log("Server started on port 3000");
});