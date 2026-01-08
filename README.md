# Keypress High Score Management API Documentation

A simple API for managing the global highscores for one of my games. This could be modified to add simple highscore management to other small games.

## Table of Contents
- [Introduction](#introduction)
- [Endpoints](#endpoints)
  - [POST /setscore](#post-setscore)
  - [POST /highscore](#post-highscore)
- [Usage](#usage)
- [License](#license)

## Introduction

The High Score Management API is built using Express.js and provides two main endpoints: one for setting high scores for users and another for fetching top ten high scores for a given difficulty level.

## Endpoints

### POST /setscore

This endpoint allows users to set their high score for a specific difficulty level.

#### Request Body

- `username` (string, required): The username of the user.
- `highscore` (number, required): The high score achieved by the user.
- `difficulty` (string, required): The difficulty level for which the high score is being set.

#### Response

- Success Response: Status code 200 with a JSON object containing a success message.
- Error Response: Status code 400 if the request body is missing any required fields, or status code 500 if there is an internal server error.

### POST /highscore

This endpoint allows users to fetch the top ten high scores for a specific difficulty level.

#### Request Body

- `difficulty` (string, required): The difficulty level for which the top ten high scores are requested.

#### Response

- Success Response: Status code 200 with a JSON object containing the top ten high scores.
- Error Response: Status code 500 if there is an internal server error.

## Usage

To use the High Score Management API, follow these steps:

1. Install Node.js and npm.
2. Clone the repository.
3. Install dependencies using `npm install`.
4. You can start the server locally using `npm start`.
5. Upload the API to the hosting service of your choice.
6. Make sure to have a corresponting postgreSQL server to store the highscore data.

## License

This project is licensed under the MIT License.
