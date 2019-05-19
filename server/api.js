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

const toDelete = [{
    "_id": "5ce1a37c349cf06a7491a52e",
    "title": "rtr",
    "amountRequired": 3433,
    "createdAt": "2019-05-19T18:42:04.664Z",
    "__v": 0
  },
  {
    "_id": "5ce1a3594a2e3f40982381cd",
    "title": "ede",
    "amountRequired": null,
    "createdAt": "2019-05-19T18:41:29.210Z",
    "__v": 0
  },
  {
    "_id": "5ce1a2765da784225c83d464",
    "title": "",
    "amountRequired": null,
    "createdAt": "2019-05-19T18:37:42.218Z",
    "__v": 0
  },
  {
    "_id": "5ce1a18e97a68943644f6e30",
    "title": "Frenk",
    "amountRequired": 1452,
    "createdAt": "2019-05-19T18:33:50.484Z",
    "__v": 0
  },
]
// // console.log('todelete ', toDelete[0]._id)


toDelete.map(el=>{
    db.findById(el._id).remove().exec()
})


routerApi.post('/deal/addDeal', async (req, res) => {
    const deal =  new db()
    deal.title=req.body.dealName
    deal.amountRequired=req.body.dealAmount
    deal.createdAt=new Date()
    deal.save()
        .then((result)=>res.send(result))
});

routerApi.post('/deal/editDeal',(req,res)=>{
    const {_id,title,amountRequired}=req.body
    db.findOneAndUpdate({_id},   {$set:{title,amountRequired}}, {new:true}  )
    .exec()
    .then(result=>res.send(result))
})
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
