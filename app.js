const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Setup connection with local MongoDB
// mongoose.connect("mongodb://localhost:27017/bunnyExpertDB");

// Connect with Cloud MongoDB
mongoose.connect("mongodb+srv://hatatwit:admin123456@cluster0.ydwrobg.mongodb.net/bunnyExpertDB");

const FoodSchema = mongoose.Schema({
  veggies: String,
  amount: String,
  image: String,
});
const Food = mongoose.model("Food", FoodSchema);

/////   -----   Setting route for requesting all food   -----   /////
app
  .route("/food")

  // Get all food from bunnyExpertDB

  .get(function (req, res) {
    Food.find(function (err, result) {
      if (!err) {
        console.log(result);
      } else {
        console.log(err);
      }
    });
  })

  // Add new food to bunnyExpertDB

  .post(function (req, res) {
    const newFood = new Food({
      veggies: req.body.veggies,
      amount: req.body.amount,
      image: req.body.image,
    });
    newFood.save(function (err) {
      if (!err) {
        res.send("Succesfully added new food into DB");
      } else {
        res.send(err);
      }
    });
  })

  // Delete all food from bunnyExpertDB

  .delete(function (req, res) {
    Food.deleteMany(function (err) {
      if (!err) {
        res.send("Succesfully deleted all food");
      } else {
        res.send(err);
      }
    });
  });


/////   -----   Setting route for requesting specific food   -----   /////

app.route("/food/:veggies")

// Get specific food

.get(function(req, res){
    Food.findOne({veggies: req.params.veggies}, function(err, result){
        if (result){
            res.send(result);
        } else {
            res.send("Not found")
        }
    })
})

// Update specific food by overide the document with new data

.put(function(req, res){
    Food.updateOne(
        {veggies: req.params.veggies},
        {veggies: req.body.veggies, amount: req.body.amount, image: req.body.image},
        {overwrite: true},
        function(err, result){
            if (!err) {
                res.send("Succesfully updated food")
            } else {
                res.send(err)
            }
        }

    )
})

// Update specific food with only provided field and data

.patch(function(req, res){
    Food.updateOne(
        {veggies: req.params.veggies},
        {$set: req.body},
        function(err, result){
            if (!err) {
                res.send("Succesfully updated food")
            } else {
                res.send(err)
            }
        }

    )
})
.delete(function(req, res){
    Food.deleteOne({veggies: req.params.veggies}, function(err){
        if (!err) {
            res.send("Succesfully delete food")
        } else {
            res.send(err)
        }
    })
});


// Listen on the correct port
let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}

app.listen(port, function() {
    console.log("Server is running");
})