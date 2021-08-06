const { fetchUsers } = require("../models/users.model");

exports.getUsers = () => {
  fetchUsers();
};
