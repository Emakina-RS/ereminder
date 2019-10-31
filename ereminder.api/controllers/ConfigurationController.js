"use strict";

const configurationService = require("../services/configurationService");

exports.CreateConfiguration = async function(req, res) {
  let user = await req.user;
  await configurationService.CreateConfiguration(req.body, user.id);

  return res.status(200).json({ message: "Configuration setup" });
};

exports.GetConfiguration = async function(req, res) {
  let user = await req.user;
  let configuration = await configurationService.GetConfiguration(user.id);

  if (!configuration) {
    return res.status(404).json({ message: "Record not found" });
  }

  return res.status(200).json(configuration);
};

exports.UpdateConfiguration = async function(req, res) {
  let user = await req.user;
  await configurationService.UpdateConfiguration(user.id, req.body);

  return res
    .status(200)
    .json({ message: "Configuration successfully updated." });
};
