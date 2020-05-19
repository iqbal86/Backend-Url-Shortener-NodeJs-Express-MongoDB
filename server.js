const express = require("express"); // import express library
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const app = express(); // if we run the express function we gonna get our variable which we can use to set up our entire application so we are gonna put that inside app.

// connect to database.
mongoose.connect("mongodb://localhost/urlShortener", {
	useNewUrlParser: true, // removes deprecation warnings.
	useUnifiedTopology: true, // removes deprecation warnings.
});

app.set("view engine", "ejs"); // set our views to use the ejs view engine.
app.use(express.urlencoded({ extended: false })); // this tells our app that we are using url parameters.

// defining rout for index.ejs
app.get("/", async (req, res) => {
	const shortUrls = await ShortUrl.find();
	res.render("index", { shortUrls: shortUrls }); // getting action from index.ejs and render with new changes.
});

// endpoint for shortUrls from ejs file.
app.post("/shortUrls", async (req, res) => {
	await ShortUrl.create({ full: req.body.fullUrl }); // post it to Schema.

	res.redirect("/"); // redirect user to home page.
});

app.get("/:shortUrl", async (req, res) => {
	const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl }); // get the short url.
	if (shortUrl == null) return res.sendStatus(404);

	shortUrl.clicks++;
	shortUrl.save();

	res.redirect(shortUrl.full); // redirect to full url.
});

app.listen(process.env.PORT || 5000); // with that express variable we pass in the port number we want to listen to.
