const createUser = require("../test/helpers/generatorHelper");
const getChatbotsExamples = require("../test/helpers/generatorHelper");
const User = require("../models/User");
const Live = require("../models/live");
/*
 *   Seeding
 *       0) emptying the DB.
 *       1) create Admin user.
 *       2) create x chatbots.
 */
const seed = () => {
  //* 0) Emptying the DB
  User.deleteMany({}).then(res => {});
  Live.deleteMany({}).then(res => {});
  //* 1) Admin user
  const user = createUser();
  user.email = "admin@email.com";
  user.password = "password";
  User.create(user)
    .then(user => {
      let id = user.id;
    })
    .catch(e => console.log(e));
};

module.exports = seed;
