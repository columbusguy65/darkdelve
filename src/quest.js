'use strict';

module.exports = {
  "quest": {
    "page": [
      {
        "-id": "1",
        "name": "start",
        "desc": "You are in a cold dark place.",
        "links": {
          "link": [
            {
              "-id": "2",
              "#text": "North"
            },
            {
              "-id": "3",
              "#text": "West"
            }
          ]
        }
      },
      {
        "-id": "2",
        "name": "first room",
        "desc": "This is 20 x 20 room.",
        "links": {
          "link": [
            {
              "-id": "1",
              "#text": "South"
            },
            {
              "-id": "3",
              "#text": "West"
            }
          ]
        }
      },
      {
        "-id": "3",
        "name": "second room",
        "desc": "This is a small antechamber.",
        "links": {
          "link": {
            "-id": "2",
            "#text": "East"
          }
        }
      }
    ]
  }
};