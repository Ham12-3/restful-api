const express= require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");



const app=express();


app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
  };

  const Article = mongoose.model("Article", articleSchema);


app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })



.post(function(req,res) {
  const newArticle= new Article ({
  title:req.body.title,
  content:req.body.content
  });

  newArticle.save(function(err){
    if (!err){
      res.send("Successfully added a new article.");
    } else {
      res.send(err);
    }
  });
})
.delete(function(req,res){
    Article.deleteMany(function(err) {
        if(!err) {
            console.log("Succesfully deleted all documents");
        }
    });
});




app.route("/articles/:specific")

.get(function(req,res) {
   
    Article.findOne({title:req.params.specific} ,function(err, found){
        if (found) {
            res.send(found);
          } else {
            res.send("No articles matching that title was found.");
          }
    });
})
.put(function(req,res) {
  Article.update (
    {title:req.params.specific},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err) {
      if(!err) {
        res.send("Successfully updated the article");
      }
    }
  );
})
.patch(function(req,res){
  Article.update(
{title:req.params.specific},
{$set: req.body},
function(err) {
if(!err) {
  console.log("Success");
} else {
  console.log(err);
}
}
  );
})
.delete(function(req,res) {
  Article.deleteOne(
    {title:req.params.specific},
    function(err) {
      if(!err) {
        res.send("successfully deleted");
      } else {
        res.send(err);
      }
    }
  );
});

app.listen(3000, function() {
    console.log("Server is up and running");
});