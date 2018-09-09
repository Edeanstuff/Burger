module.exports = function(sequelize, DataTypes) {
  var Burg = sequelize.define("Burg", {
    burger: DataTypes.STRING,
    eaten: DataTypes.BOOLEAN
  });
  return Burg;
};
