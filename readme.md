# NodeJS service
This service listens for messages from client devices (typically Mikrotik routers), and extracts information from the messages as time series data.

Data points are called Tags, and can be e.g. Airtime, Data balances, signal level, signal quality, etc, or any numeric value that can be measured on a router.

## api.js
API accepting http post requests with data from managed routers

## server.js
Main service runtime script.

## config.js
On-disk configuration management

## postgre.js
PostgeSQL database communication logic

