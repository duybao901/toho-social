# toho-social
This project is mini social

## DEMO
https://toho-network.herokuapp.com/

## NOTE
If you want to use project, please download in main branche

## Author: Bao Duy

Install dependencies for server

## npm install
Install dependencies for client
cd client ---> npm install

## Connect to your mongodb and add info in .env
*

MONGODB_URL = '...'
ACCESS_TOKEN_SECRET =  '...'
REFRESH_TOKEN_SECRET =  '...'

CLOUD_NAME =  '...'
API_KEY = '...'
API_SECRET = '...'

MAILING_SERVICE_CLIENT_ID =  '...'
MAILING_SERVICE_CLIENT_SECRET = '...'
MAILING_SERVICE_REFRESH_TOKEN =  '...'
SENDER_EMAIL_ADDRESS = '...'

CLIENT_URL = http://localhost:3000
*

## Run the client & server with concurrently
npm run dev

## Run the Express server only
npm run server

## Run the React client only
npm run client

## Server runs on http://localhost:5000 and client on http://localhost:3000
User interface

![screenshot_1630474599](https://user-images.githubusercontent.com/67371206/131617849-ff47958a-026d-4880-bd93-4e1405272911.png)
