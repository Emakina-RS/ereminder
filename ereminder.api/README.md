# ereminder.api

Backend is developed in Node.js.

## Table of Contents

 - [Introduction](#introduction)
 - [Install](#install)
 - [Available Scripts](#availableScripts)


# Introduction

Directory tree in ereminder.api: 

    .
    ├── config                  # Constants and configuration
    ├── controllers             # Controllers written in Node.js
    ├── core                    # Core files (mailer.js and scheduler.js)
    ├── emails                  # Email templates
    ├── errors                  # Possible errors (Bad input error and invalid response object)
    ├── helpers                 # Helper files (like encryptionHelper.js script to encrypt or decrypt text)
    ├── middleware              # Middlewars functions (authentication, errors, validators and rate limiters)
    ├── models                  # Models of index, initial configuration, interval, notification, notification types and user
    ├── routes                  # Routes which are possible on this project
    ├── services                # Service files (Calendar Service, Configuration Service, Notification Service and User Service)
    ├── startup                 # Startup files (logger.js file)
    ├── config.json             # Configuration file, where is 3 possilbe stages (development, production and testing)
    ├── dbInitializer.js        # Database initializer
    ├── package-lock.json       
    ├── package.json            
    ├── server.js               # Starting server script
    └── README.md

## Install

Installing all possible node_modules used in this project are doing by setting path in ereminder.api directory and typing commad:

### `npm install`


## Available Scripts

In the project directory, starting server is doing by opening terminal in ereminder.api folder and typing command:

### `npm start`

Runs the app in the development mode on http://localhost:8080.

### `npm run build`

Builds the app for production to the `build` folder.
