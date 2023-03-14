const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/articleModel');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true

}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

// Chain route handlers for /articles route for GET, POST, and DELETE requests
app
  .route('/articles')
  .get(async (req, res) => {
    const articles = await Article.find(); // find all articles
    if (articles) {
      res.send(articles);
    } else {
      res.send('No articles found.');
    }
  })
  .post(async (req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    try {
      const savedArticle = await article.save();
      res.send(savedArticle);
    } catch (err) {
      res.send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const deletedArticles = await Article.deleteMany();
      res.send(deletedArticles);
    } catch (err) {
      res.send(err);
    }
  });

// Chain route handlers for /articles/:articleTitle route for GET, PUT and DELETE requests

  // GET a specific article
    app.route('/articles/:articleTitle')
    .get(async (req, res) => {
        const article = await Article.findOne({title: req.params.articleTitle});
        if (article) {
            res.send(article);
        } else {
            res.send('No article found.');
        }
    })
    // PUT (update) a specific article
    .put(async (req, res) => {
        const updatedArticle = await Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content}
        );
        res.send(updatedArticle);
    })
    // DELETE a specific article
    .delete(async (req, res) => {
        const deletedArticle = await Article.deleteOne({title: req.params.articleTitle});
        if(deletedArticle) {
            res.send("Article Successfully deleted.");
        }
        else {
            res.send('No article found.');
        }
    });



app.listen(3000, function() {
    console.log("Server started on port 3000");
});