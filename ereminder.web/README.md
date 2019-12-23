This project was bootstrapped with [Create React App][1].

# ereminder.web


## Table of Contents

 - [Introduction](#introduction)
 - [Install](#install)
 - [Available Scripts](#availableScripts)

# Introduction

Directory tree in ereminder.api: 

    .
    ├── public                  # index.html file, icon and .svg files
    ├── src                     # src folders and files
    │   ├── assets              # fonts, icon and images files 
    │   ├── components          # component files including .css files
    │   ├── hooks               # hooks files
    │   ├── pages               # pages files including .css files
    │   ├── reducers            # reducer files
    │   ├── action.js           # possible actions 
    │   ├── App.css             # .css file for App.js
    │   ├── App.js              # Definied header for application 
    │   ├── index.css           # 
    │   └── index.js            # 
    ├── .env.development        # .env for development
    ├── .env.production         # .env for production
    ├── package.json            #
    └── README.md

## Install

Installing all possible node_modules used in this project are doing by setting path in ereminder.api directory and typing commad:

### `npm install`


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode on http://localhost:3000.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run storybook`

Runs [Storybook][2] on http://localhost:9009.

[1]: https://github.com/facebook/create-react-app
[2]: https://storybook.js.org

## Deployment.  

### `pre deployment steps`

Before running scripts for code build. Check is appropriate variables are settled in `.env.development` file.
HOST=ereminder.com
PORT=8080
REACT_APP_API_URL=http://ereminder.com:8081

Check one again, does in API `config.json` in the production section of file corsUrls set to http://ereminder.com:8080",
and also check is "apiUrl": "http://ereminder.com/", "apiPort": 8081 set to this params.

Then move to next step.

### `npm run build`

Builds the app for production to the build folder.
Successful build should create a build folder in `ereminde.web` folder structure.

### `build folder`

This folder is needed for deployment on a web server. `Build` folder should copy on the deployment server.

### `Deploy the application to IIS`

Open IIS. 

Now, right-click on Sites and click on "Add web sites".

Enter the site name, add any meaningful name in this textbox, in the physical path, enter the path where build folder path is copied and located.

For example:
-Site name: `web.ereminder`
-Physical path: `Path to build folder`
-IP adresss: `127.0.0.1`
-Port: `8080`
-Host name: `dev.ereminder.com`

Click on ok Button 

Now, right-click on `web.ereminder` and click on "Add Application". Fill the alias name and set the physical path.

Enter the Alias and Physical path
-Alias: `web.ereminder`
-Physical path: `Path to build folder`

Click on ok Button 

### `Use the application`

Now web application is deployed

