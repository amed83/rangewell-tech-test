# rangewell-tech-test

We are giving you an initial react application (bootstrapped with [Create React App](https://github.com/facebook/create-react-app)) with a datamodel and a first api endpoint `http://localhost:3001/api/deals`, connected to a mongodb.

___

## Available Scripts

In the project directory, you can run:

### `npm install`
To install all the dependencies

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run server`

Runs the server.<br>
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

___

## Requests

1. Edit the endpoint `http://localhost:3001/api/deals`, to be able to get a list of deals with certain filter passed by query string. Example: http://localhost:3001/api/deals?title=test will return all the deals with title equal to 'test'

2. Add a new endpoint `http://localhost:3001/api/deal/{id}` that will return a single deal by ID.

3. Add a new endpoint `http://localhost:3001/api/deals/stats` that will return:
```json
{
    deals_count: 200,       // number of deals
    total_amounts: 200000,  // total amountRequired of deals
    avg_amount: 3000        // average of deals  amountRequired
}
```

4. Show the list of deals order by create date, showing the most recent first.

5. Create a filter to show all deals created from a certain date.

6. Show stats of deals on top of the page using the endpoint previously created `http://localhost:3001/api/deals/stats`.

## Stretch 
Do you still have time, here some other task?
1. Itegrate Redux on react application
2. Insert a new deal
3. Edit a deal

## Submission
Please share your finished work on a new branch on this repository or create a new fork.
