<div align="center">
  <h1>Buyte Dashboard</h1>
</div>

<div align="center">
  <strong>A single-page dashboard application for <a href="https://github.com/rsoury/buyte">Buyte</a> - digital wallet payment orchestration, built with <a href="https://github.com/facebook/create-react-app">CRA</a>, altered with <a href="https://github.com/harrysolovay/rescripts">Rescripts</a> and powered by GraphQL and Serverless Functions</strong>
</div>

<br/>

![Buyte Banner](https://github.com/rsoury/buyte-dashboard/blob/master/docs/1.%20Your%20Digital%20Wallet%20Checkouts%20in%20one%20place.png)

<div align="center">
   <a href="https://github.com/rsoury/buyte-dashboard/blob/master/docs/">Walkthrough Images</a>
</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation Requirements](#installation-requirements)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Local Development](#local-development)
- [Contribution](#contribution)
- [Enterprise Support](#enterprise-support)
- [Found this repo interesting?](#found-this-repo-interesting)

## Installation Requirements

- Node.js 10.0+

## Getting Started

1. Clone the repository `git clone git@github.com:rsoury/buyte-dashboard.git`
2. Install Node.js Dependencies: `yarn`
3. Copy your `aws-exports.js` file from your Amplify Environment to this project's Root Directory
4. Copy `.env.example` to `.env`, `.env.development` or `.env.production` and configure you environment settings.
5. `yarn build`

## Deployment

1. Deploy your React App.
   [Netlify](https://netlify.com/) is a great service for hosting static websites
2. Deploy your Serverless Functions
   ```
   sls deploy --stage prod --env production --region ap-southeast-2
   ```
   
## Local Development

In one tab, start your React App - `yarn start`
In another tab, start your offline serverless API - `yarn start:connect`

## Contribution

Simply fork this repo and make it your own, or create a pull request and we can build something awesome together!

## Enterprise Support

Looking to integrate a Legacy Payment Processor or Banking API? Contact us at [Web Doodle](https://www.webdoodle.com.au/?ref=github-buyte) to discuss tailored solutions.

## Found this repo interesting?

Star this project ⭐️⭐️⭐️, and feel free to follow me on [Github](https://github.com/rsoury), [Twitter](https://twitter.com/@ryan_soury) or [Medium](https://rsoury.medium.com/)