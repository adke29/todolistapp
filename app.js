//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname +"/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))

mongoose.connect("mongodb+srv://admin-kevin:Test123456@cluster0.6ehnxuj.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
    itemName: String
})

const listsSchema = new mongoose.Schema({
    listName :String,
    items:[itemsSchema]
});

const Items = mongoose.model("defaults",itemsSchema);
const Lists = mongoose.model("customs",listsSchema);


//Starts here

app.get("/", async function (req, res) {  
    var lists = [];
    await Items.find({}).then(function(items){
        lists = items;
    })
    res.render("list", {
        listName: "Home",
        myLists: lists
    });

    
    
});


app.post("/",function(req,res){
    let input = req.body.newInput;
    const urlListName = _.lowerCase(req.body.button);
    const newItem = new Items({
        itemName: input
    })
    if(urlListName === "home"){
        newItem.save();
        res.redirect("/");
    }else{
        Lists.findOne({listName:urlListName}).then(function(data){
            data.items.push(newItem);
            data.save();
            res.redirect("/custom/" +_.capitalize(urlListName));
        })
        
    }
    
});

app.get("/custom/:listName",function(req,res){
    var urlListName = _.lowerCase(req.params.listName);
    Lists.findOne({listName:urlListName}).then(function(data){
        if(!data){
            const newList = new Lists({
                listName: urlListName,
                items:[]
            })
            newList.save();
            res.render("list",{
                listName:_.capitalize(urlListName),
                myLists:[]
                })
        }else{
            res.render("list",{
                listName:_.capitalize(urlListName),
                myLists:data.items
            })
        
        }})
    
    

})








app.post("/delete",async function(req,res){
    const target = req.body.checkbox;
    const urlListName = _.lowerCase(req.body.listName);
    if(urlListName === "home"){
        await Items.findByIdAndDelete(target)
        res.redirect("/");
    }else{
        await Lists.findOneAndUpdate({listName:urlListName},{$pull:{items:{_id:target}}})
        res.redirect("/custom/"+_.capitalize(urlListName));
    }

    
});



app.get("/about", function(req,res){
    res.render("about");
})

let port =process.env.PORT;
if(port === NULL || port ===""){
    port = 3000;
}

app.listen(port, function () {
    console.log("Server started on port "+ port);
});