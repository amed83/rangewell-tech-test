const express= require('express');

const routerApi = express.Router();
const mongoose = require('mongoose')
//mongodb models
const db = require("./data/models");



//routes
routerApi.get("/deals", async (req, res) => {
    let title;
    if( Object.keys(req.query).length>0 ){
        title = req.query.title
    }
    if(title){
        db.find({ $text: { $search: title} }).exec(function(err, result) {
            if(result.length<1){
                res.send('No result for this search')
                return
            }
            res.send(result);
        });
    }
    else{
        db.find()
        .sort({createdAt:'desc'})
        .exec(function(err, result) {
            res.send(result);
        });
    }
    
});

routerApi.get('/deal/:id', async (req, res) => {
    const {id} = req.params
    db.findById(id).exec(function(err, result) {
        res.send(result);
    });
});

// 20190515192049
// http://localhost:3001/api/deals/

const toDelete = [
    {
      "_id": "5cdc585c71f7f02968bac8ca",
      "title": "rfe",
      "amountRequired": 4343,
      "createdAt": "2019-05-15T18:20:12.826Z",
      "__v": 0
    },
    {
      "_id": "5cdc582f0085ca610409b67f",
      "title": "iji",
      "amountRequired": 676,
      "createdAt": "2019-05-15T18:19:27.548Z",
      "__v": 0
    },
    {
      "_id": "5cdc5801654aab5afc1e9d65",
      "title": "rrrtt",
      "amountRequired": 909,
      "createdAt": "2019-05-15T18:18:41.859Z",
      "__v": 0
    },
    {
      "_id": "5cdc57da9045b55564e6f839",
      "title": "tr",
      "amountRequired": 434,
      "createdAt": "2019-05-15T18:18:02.018Z",
      "__v": 0
    },
    {
      "_id": "5cdc57af9045b55564e6f838",
      "title": "ere",
      "amountRequired": 4343,
      "createdAt": "2019-05-15T18:17:19.537Z",
      "__v": 0
    },
    {
      "_id": "5cdc5788a44f2512b4e97fbb",
      "title": "test54",
      "amountRequired": 4224,
      "createdAt": "2019-05-15T18:16:40.006Z",
      "__v": 0
    },
    {
      "_id": "5cdc5756405e754e08d238e2",
      "title": "test5",
      "amountRequired": 4343,
      "createdAt": "2019-05-15T18:15:50.061Z",
      "__v": 0
    },
    {
      "_id": "5cdc572cbafcb31b4813bfb2",
      "title": "test4",
      "amountRequired": 322,
      "createdAt": "2019-05-15T18:15:08.581Z",
      "__v": 0
    },
    {
      "_id": "5cdc5724bafcb31b4813bfb1",
      "title": "test3",
      "amountRequired": 34,
      "createdAt": "2019-05-15T18:15:00.937Z",
      "__v": 0
    },
    {
      "_id": "5cdc56f3ad08b351240badd7",
      "title": "test3",
      "amountRequired": 34,
      "createdAt": "2019-05-15T18:14:11.411Z",
      "__v": 0
    },
    {
      "_id": "5cdc56f2ad08b351240badd6",
      "title": "test3",
      "amountRequired": 34,
      "createdAt": "2019-05-15T18:14:10.004Z",
      "__v": 0
    },
    {
      "_id": "5cdc5665b75db76238faa5a1",
      "title": "test2",
      "amountRequired": 2,
      "createdAt": "2019-05-15T18:11:49.128Z",
      "__v": 0
    },
    {
      "_id": "5cdc5624b75db76238faa5a0",
      "title": "testing deal",
      "amountRequired": 343,
      "createdAt": "2019-05-15T18:10:44.942Z",
      "__v": 0
    }
]
// console.log('todelete ', toDelete[0]._id)
// db.findById(toDelete[0]._id).remove().exec()
// 
// toDelete.map(el=>{
//     let _id = el._id
//     console.log(el._id)
//     db.findById(el._id).remove().exec()
// })
// 

routerApi.post('/deal/addDeal', async (req, res) => {
    const deal =  new db()
    deal.title=req.body.dealName
    deal.amountRequired=req.body.dealAmount
    deal.createdAt=new Date()
    deal.save()
        .then((result)=>res.send(result))
});

routerApi.get(`/deals/stats`, async (req, res) => {

    db.aggregate([
        {
        $match:{},    
        },
        {
            $group:{
                _id:'totalDocs',
                deals_count:{$sum:1},
                total_amount:{$sum:'$amountRequired'},
                avg_amount:{$avg:'$amountRequired'}
            }
        }
    ])
    .exec(function(err,result){
        res.send(result)
    })
    
});



module.exports= routerApi;
