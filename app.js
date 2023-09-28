const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

    .get(function(req, res){

        async function findArticles(){
            const foundArticles = await Article.find().exec();
            res.send(foundArticles);
        }

        findArticles();
    })

    .post(function(req, res){
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save();
        res.send("Successfully saved");
        
    })

    .delete(function(req, res){
        async function deleteAll(){
            await Article.deleteMany();
        }

        deleteAll();
        res.send("Deleted all articles successfully.");
    });

app.route("/articles/:articleTitle")

    .get(function(req, res){
       
        async function getArticle(){
            const foundArticle = await Article.findOne({title: req.params.articleTitle}).exec();
            
            if(foundArticle)    
                res.send(foundArticle);
            else
                res.send("No Article with specified Title is found!");
        }

        getArticle();
    })


    .put(function(req, res){
        async function putArticle(){
            await Article.replaceOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content});
            res.send("Successfully updated the document.");
        }

        putArticle();
    })

    .patch(function(req, res){
        async function patchArticle(){
            await Article.updateOne({title: req.params.articleTitle}, req.body);
            res.send("Successfully updated the document.");
        }

        patchArticle();
    })

    .delete(function(req, res){
        async function deleteArticle(){
            await Article.deleteOne({title: req.params.articleTitle});
            res.send("Successfully deleted the article on " + req.params.articleTitle);
        }

        deleteArticle();
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});