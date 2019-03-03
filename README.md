# occ-api-utils
Oracle Commerce Cloud API Utilities

The goal of this project is to make it easier to use the Oracle Commerce Cloud APIs for backing up data or for migrating data from once instance to antoher. Features

- Allows you to export a productType from one instance and import it into another instance

Setup:
```
npm install stjs 
npm install request
npm install fs
```

Create a target-host.json file with the host and api key for the target host.

to run:
nodejs main.js [file]

example:
node main.js input/shirt.json

