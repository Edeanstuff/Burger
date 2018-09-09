
var db = require("../models");

module.exports = function(app) {

  app.get("/api/burgs", function(req, res) {
    db.Burg.findAll({}).then(function(dbBurg){
      res.json(dbBurg);
    
    });

  });

  app.post("/api/burgs", function(req, res) {
    db.Burg.create({
      burger: req.body.burger,
      eaten: req.body.eaten
    }).then(function(dbBurg) {
      res.json(dbBurg);
    });

  });

  app.delete("/api/burgs/:id", function(req, res) {
    db.Burg.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbBurg) {
      res.json(dbBurg);
    });


  });

  app.put("/api/burgs", function(req, res) {
    db.Burg.update({
      burger: req.body.burger,
      eaten: req.body.eaten
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(dbBurg) {
      res.json(dbBurg);
    });
  });
};
