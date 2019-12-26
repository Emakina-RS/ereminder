# ereminder
Hackathon 2019 - Code For a Cause 3

## Table of Contents

 - [Introduction](#introduction)
 - [Install](#install)
 - [Contributing](#contributing)
 - [Deployment](#deployment)
 - [Starting application](#startingApplication)
 - [License](#licanse)


## Introduction

Ereminder project is separated in two directories, ereminder.api and ereminder.web. In first directory is code which is written in Node.js. In second directory is code which is writtend in React.js. 
In ereminder.api is backend code.
In ereminder.web is frontend code.

## Install

When project is downloaded, follow the instroctions. Open terminal in ereminder.api directory and install all node_modules using the command:

### `npm install`

When process is finished, open terminal in ereminder.web directory and install all node_modelus in that directory using the command:

### `npm install`

When process is finished, in the ereminder.api project directory use the following command in the terminal: 

### `npm start`

After starting the server, in the ereminder.web project directory use the following command in the terminal: 

### `npm start`


## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Required extensions for deployment

Extensions which are needed for IIS (Internet Information Services) Manager are: 

1) [Url Rewrite extension](https://www.iis.net/downloads/microsoft/url-rewrite)  <br>
2) [Application Request Routing extension](https://www.iis.net/downloads/microsoft/application-request-routing) <br>



## Deployment 

When deployment process is beginning, first open the terminal in ereminder.api and start server.js script using the command: 

### `npm start`

Then open hosts file, which should be in the next path: `C:\Windows\System32\drivers\etc` and open it by text editor (e.g Notepad++) and use next domains:  </br> </br>

`127.0.0.1 dev.ereminder.com`  </br>
`127.0.0.1 dev-api.ereminder.com`  </br>
`127.0.0.1 dev-reverseproxy.ereminder.com` </br>  

</br> </br>

Open IIS (Internet Information Services) Manager and follow the instructions: <br>
1) Select Sites, right-click and choose `Add Website...` <br>
2) In Site name type: `dev.reverseproxy.ereminder` <br>
3) `Physical path` should be selected inside wwwroot folder, which should be on the next path: `C:\inetpub\wwwroot` <br>
4) Inside `IP address` select IP address which you wrote in hosts file <br>
5) Inside `Port`, choose the port which you will use in `.env.development`, `.env.production` or `.env.test` <br>

When the previous steps are finished, select dev.reverseproxy.ereminder and then select `URL Rewrite`. Inside `Inbound rules that are applied to the requested URL adress`, right-click and `Add Rule(s)`, than choose `Reverse Proxy`. Inside `Enter the server name or the IP address where HTTP requests will be forwarded` put inside: <br>
`dev-api.ereminder.com` <br>
Check the checkobx inside "Outbound Rules", and select To, which are drop-down manu, and select `dev-reverseproxy.ereminder.com`

After this steps are finished, open `.env.production`, `.env.development` or `.env.test`, and inside of REACT_APP_API_URL, put the domain from hosts file and PORT.<br>
Than open the terminal in ereminder.web and type following command: 

### `npm run build`

The best practice is if you have build folder or node_modules folder in your project, first delete it, and first install all modules using the command: 

### `npm install`

Wait until the process is finished, then use the command: 

### `npm run build`

After process is finished, use that whole build folder and save it on your PC or laptop, and remember the path where you put that build folder. <br>
Then you need to configure frontend code in IIS (Internet Information Services) Manager. Configuration of frontend code are described in ereminder.web/Readme.md file. <br>
Select the Sites section and choose option `Add Website`. Inside `Site name: ` type `web.ereminder`. `Physical path: ` should be `path to the build folder` and `IP address` should be selected and read from hosts file. 

## Starting application 

pm2 is Node.js process manager, and it is using to keep applications running. Installing pm2 with npm: 

### `npm install -g pm2`

Use following commands to manage our processes:
 - `pm2 start server.js` - start our Node.js application <br>
 - `pm2 stop` - stop a running process <br>
 - `pm2 restart` - restart a running process <br>
 - `pm2 list` - list all running processes <br>

Official site for pm2: [link](https://pm2.keymetrics.io/)

### `Use the application`

Now web application is deployed



## License

[MIT License ©.](../LICENSE)