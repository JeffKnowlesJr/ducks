const express = require("express"),
         path = require('path'),
           bp = require("body-parser"),
     mongoose = require("mongoose"),
          app = express(),
         port = 9000;

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(express.static(path.join(__dirname, './client/static')));
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/ducks');

var DuckSchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    favpond: String
   })
mongoose.model('Duck', DuckSchema);
var Duck = mongoose.model('Duck')

app.get("/", function(req, res){
    Duck.find({}, function(err, ducks){
        res.render("index.ejs", {ducks: ducks})
    })
});

app.post("/duck", function(req, res){
    let duck = new Duck(req.body);
    duck.save(function(err){
        console.log(err);
        res.redirect("/");
    });
});

app.listen(port, function() {
    console.log();
});

app.get('/ducks', function(req, res){
    Duck.find({}, function(err, ducks){
        if(err){
           console.log("Returned error", err);
            // respond with JSON
           res.json({message: "Error", error: err})
        }
        else {
            // respond with JSON
           res.json({message: "Success", data: ducks})
        }
     })
});

app.get('/ducks/:id', function(req, res){
    var id = req.params.id;
    console.log(id);
    Duck.find({"_id" : id}, function(err, duck){
        if(err){
           console.log("Returned error", err);
           console.log("Failed to return ", id);
            // respond with JSON
           res.json({message: "Error", error: err});
        }
        else {
          // respond with JSON
          console.log("Returned ", id);
          res.json({message: "Success", data: duck});
        }
     })
})

app.get('/ducks/:id/delete', function(req, res){
    var id = req.params.id;
    console.log(id);
    Duck.deleteOne({"_id" : id}, function(err){
        if(err){
           console.log("Returned error", err);
           console.log("Failed to return ", id);
            // respond with JSON
           res.json({message: "Error", error: err});
        }
        else {
          // respond with JSON
          console.log("Returned ", id);
          res.redirect("/");
        }
     })
})

app.get('/ducks/:id/edit', function(req, res){
    var id = req.params.id;
    console.log(id);
    Duck.findOne({"_id" : id}, function(err, mighty_duck){
        if(err){
           console.log("Returned error", err);
           console.log("Failed to return ", id);
            // respond with JSON
           res.json({message: "Error", error: err});
        }
        else {
          // respond with JSON
          console.log("Returned ", id);
          console.log("duck:", mighty_duck);
          res.render("edit.ejs", {duck:mighty_duck});
        }
     })
})

app.post('/ducks/:id/edit', function(req, res){
    var id = req.params.id;
    let upDuck = new Duck(req.body);
    console.log(id);
    Duck.findOne({"_id" : id}, function(err, mighty_duck){
        if(err){
           console.log("Returned error", err);
           console.log("Failed to return ", id);
            // respond with JSON
           res.json({message: "Error", error: err});
        }
        else {
          // respond with JSON
          console.log("Returned ", id);
          console.log("duck:", mighty_duck);
          mighty_duck.name = upDuck.name;
          mighty_duck.gender = upDuck.gender;
          mighty_duck.age = upDuck.age;
          mighty_duck.favpond = upDuck.favpond;
          mighty_duck.save(function(err){
              console.log(err);
              res.redirect("/");
          });
        }
     })
})
// app.post("/duck", function(req, res){
//     let duck = new Duck(req.body);
//     duck.save(function(err){
//         console.log(err);
//         res.redirect("/");
//     });
// });
