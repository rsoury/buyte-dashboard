# Buyte Dashboard

A single-page dashboard application for <a href="https://github.com/rsoury/buyte">Buyte</a> - digital wallet payment orchestration, built with <a href="https://github.com/facebook/create-react-app">CRA</a>, altered with <a href="https://github.com/harrysolovay/rescripts">Rescripts</a> and powered by GraphQL and Serverless Functions

![Buyte Banner](https://github.com/rsoury/buyte-dashboard/blob/master/docs/dashboard-walkthrough/1.%20Your%20Digital%20Wallet%20Checkouts%20in%20one%20place.png)

## Demo

[See walkthrough images of Buyte Dashboard](https://github.com/rsoury/buyte-dashboard/blob/master/docs/dashboard-walkthrough/)

## Getting Started

These instructions will get you a copy of the project built for deployment or local development.

### Prerequisites

- Node.js 10.0+

### Set up

1. Clone the repository `git clone git@github.com:rsoury/buyte-dashboard.git`
2. Install Node.js Dependencies: `yarn`
3. Copy your `aws-exports.js` file from your Amplify Environment to this project's Root Directory
4. Copy `.env.example` to `.env`, `.env.development` or `.env.production` and configure you environment settings.
5. `yarn build`

### Deployment

1. Deploy your React App.
   [Netlify](https://netlify.com/) is a great service for hosting static websites
2. Deploy your Serverless Functions
   ```
   sls deploy --stage prod --env production --region ap-southeast-2
   ```
   
### Local Development

1. In one tab, start your React App - `yarn start`
2. In another tab, start your offline serverless API - `yarn start:connect`

### Set up Cognito App Client

It is important to configure your Cognito App Client to allow the correct OAuth Flows, and use the correct Callback URL(s) and Sign out URL(s).  
[Here an image of an example configured App Client](https://github.com/rsoury/buyte-dashboard/blob/master/docs/cognito-app-client.png).  
Please be sure to configure the App Client with the Client ID referenced in your `aws-exports.js` file.  

## Contribution

Simply fork this repo and make it your own, or create a pull request and we can build something awesome together!

## Enterprise Support

Whether you're looking to integrate a Legacy Payment Processor or Banking API, or looking for managed deployment and operation in your cloud, you can contact us at [Web Doodle](https://www.webdoodle.com.au/?ref=github-buyte) to discuss tailored solutions.

## Found this repo interesting?

Star this project ⭐️⭐️⭐️, and feel free to follow me on [Github](https://github.com/rsoury), [Twitter](https://twitter.com/@ryan_soury) or [Medium](https://rsoury.medium.com/)