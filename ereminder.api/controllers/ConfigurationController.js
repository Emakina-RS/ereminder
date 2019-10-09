'use strict'

const configurationService = require('../services/configurationService');

exports.CreateConfiguration = async function(req, res) {
    try {
        let user = await req.user;
        await configurationService.CreateConfiguration(req.body, user.id);

        return res.status(200).json({ message: 'Configuration setup' });
    }
    catch (e) {
        return res.status(500).json({ error: 'Internal error' });
    }
 }

exports.GetConfiguration = async function(req, res) {
    try {
        let user = await req.user;
        let configuration = await configurationService.GetConfiguration(user.id);

        if (!configuration) {
            return res.status(404).json({ message: 'Record not found' });
        }

        return res.status(200).json(configuration);
    }
    catch(e) {
        return res.status(500).json({ error: 'Internal error' })
    }
}

exports.UpdateConfiguration = async function(req, res) {
    try {
        let user = await req.user;
        await configurationService.UpdateConfiguration(user.id, req.body);

        return res.status(200).json({ message: 'Configuration successfully updated.' });
    }
    catch (e) {
        return res.status(500).json({ error: 'Internal error' });
    }
 }