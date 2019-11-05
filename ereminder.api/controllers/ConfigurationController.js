"use strict";

const configurationService = require("../services/configurationService");

exports.CreateConfiguration = async function(req, res) {
  await configurationService.CreateConfiguration(req.body, req.user.id);

  return res.status(200).json({ message: "Configuration setup" });
};

exports.GetConfiguration = async function(req, res) {
  let configuration = await configurationService.GetConfiguration(req.user.id);

  if (!configuration) {
    return res.status(404).json({ message: "Record not found" });
  }

  return res.status(200).json(configuration);
};

exports.UpdateConfiguration = async function(req, res) {
  await configurationService.UpdateConfiguration(req.body, req.user.id);

  return res
    .status(200)
    .json({ message: "Configuration successfully updated." });
};
