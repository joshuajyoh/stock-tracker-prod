# stock-tracker-prod

A web app for tracking financial stock behaviour using technical indicators.

This repo contains the complete application with minified front-end code. To view the un-minified front-end logic, see https://github.com/joshuajyoh/stock-tracker-fe.

This is a continuous personal project: It is currently functional (see live site below), but I am always working on improvements/new features.

## Live Site

https://joshuajyoh.com/

## Solution Stack

**Back-end**: NodeJS, ExpressJS, MySQL

**Front-end**: JavaScript, VueJS, HTML, CSS

## Features

**Stock List**: Search for and add financial stocks to a list, displaying name, price, and event status (see Event List).

**Event List**: For a specified stock, create custom 'events' pertaining to the values of technical indicators (e.g. Check for when the 50-day average is above 
$25). An event's 'status' indicates whether the event condition has been triggered.

**Accounts**: Create accounts to log in with that will save your custom stock list.

## Technical Indicators

- Price
- [Moving Average](https://www.investopedia.com/terms/m/movingaverage.asp#:~:text=of%20Moving%20Averages-,Simple%20Moving%20Average,-A%20simple%20moving)
- [Exponential Moving Average](https://www.investopedia.com/terms/m/movingaverage.asp#:~:text=Jiang%20%C2%A9%20Investopedia%C2%A02021-,Exponential%20Moving%20Average%20(EMA),-The%20exponential%20moving)
- [Fast/Slow Stochastics](https://www.investopedia.com/terms/s/stochasticoscillator.asp)

## Images

Stocks Page
![Stocks Page][st-1]

[st-1]: https://github.com/joshuajyoh/stock-tracker-prod/blob/37736a9514e51b1e99a427643323ca5422609521/github/images/st-1.png

Events Page
![Events Page][st-2]

[st-2]: https://github.com/joshuajyoh/stock-tracker-prod/blob/37736a9514e51b1e99a427643323ca5422609521/github/images/st-2.png

Adding an Event
![Add an Event][st-3]

[st-3]: https://github.com/joshuajyoh/stock-tracker-prod/blob/37736a9514e51b1e99a427643323ca5422609521/github/images/st-3.png
