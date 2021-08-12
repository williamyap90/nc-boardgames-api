const {
  fetchUsers,
  fetchUserByUsername,
  patchUserByUsername,
  insertNewUser,
} = require("../models/users.model");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewUser = (req, res, next) => {
  const newUserBody = req.body;
  insertNewUser(newUserBody)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername({ username })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateUserByUsername = (req, res, next) => {
  const { username } = req.params;
  const updateUser = req.body;
  patchUserByUsername({ username, updateUser })
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
