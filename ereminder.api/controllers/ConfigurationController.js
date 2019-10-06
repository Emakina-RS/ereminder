'use strict'

const authenticationHelper = require('../helpers/authenticationHelper');
const configurationService = require('../services/configurationService');

exports.CreateConfiguration = async function(req, res) {
    try {
        var currentUserId = authenticationHelper.getUserIdFromRequest(req);
        if(!currentUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await configurationService.CreateConfiguration(req.body, currentUserId);
        return res.status(200).json({ message: 'Configuration setup' });
    }
    catch (e) {
        return res.status(500).json({ error: 'Internal error' });
    }
 }

exports.GetConfiguration = async function(req, res) {
    try {
        let currentUserId = authenticationHelper.getUserIdFromRequest(req);
        let dashboard = await configurationService.GetConfiguration(currentUserId);

        return res.status(200).json(dashboard);
    }
    catch(e) {
        return res.status(500).json({ error: 'Internal error' })
    }
}

exports.UpdateConfiguration = async function(req, res) {
    try {
        var currentUserId = authenticationHelper.getUserIdFromRequest(req);
        if(!currentUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await configurationService.UpdateConfiguration(currentUserId, req.body);
        return res.status(200).json({ message: 'Configuration successfully updated.' });
    }
    catch (e) {
        return res.status(500).json({ error: 'Internal error' });
    }
 }