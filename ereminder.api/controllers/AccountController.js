"use strict";

const util = require("util");
const userService = require("../services/userService");

exports.Register = async function (req, res) {
  await userService.register(req.body.email, req.body.password);
  return res
    .status(200)
    .json({ message: "Account confirmation email has been sent." });
};

exports.RegisterConfirmation = async function (req, res) {
  await userService.registerConfirmation(req.body.token);
  return res
    .status(200)
    .json({ message: "The account has been successfully confirmed." });
};

exports.ForgotPassword = async function (req, res) {
  await userService.sendForgotPasswordEmail(req.body.email);

  res.status(200).json({
    message: util.format(
      "If there's an account for %s, an email is sent with a link to reset password.",
      req.body.email
    )
  });
};

exports.ResetPassword = async function (req, res) {
  await userService.resetPassword(req.body.token, req.body.password);

  res.status(200).json({
    message: util.format("Password has been successfully reset.")
  });
};
