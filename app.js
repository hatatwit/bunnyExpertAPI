const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// Config CORS
app.use(cors({origin: '*'}));

// Setup connection with local MongoDB
// mongoose.connect("mongodb://localhost:27017/bunnyExpertDB");

// Connect with Cloud MongoDB
mongoose.connect("mongodb+srv://hatatwit:admin123456@cluster0.ydwrobg.mongodb.net/bunnyExpertDB");

const FoodSchema = mongoose.Schema({
  food: String,
  quantity: String,
  imgURL: String,
});
const Food = mongoose.model("Food", FoodSchema);

/////   -----   Setting route for requesting all food   -----   /////
app
  .route("/food")

  // Get all food from bunnyExpertDB

  .get(function (req, res) {
    Food.find(function (err, result) {
      if (!err) {
        res.send(result);
      } else {
        res.send(err);
      }
    });
  })

  // Add new food to bunnyExpertDB

  .post(function (req, res) {
    const newFood = new Food({
      food: req.body.food,
      quantity: req.body.quantity,
      imgURL: req.body.imgURL,
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

app.route("/food/:key")

// Get specific food

.get(function(req, res){
    Food.findOne({food: req.params.key}, function(err, result){
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
        {food: req.params.food},
        {food: req.body.food, quantity: req.body.quantity, imgURL: req.body.imgURL},
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
        {food: req.params.food},
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
    Food.deleteOne({food: req.params.food}, function(err){
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