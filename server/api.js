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



const toDelete = [{
    "_id": "5ce1a63571f66d425c3bccb9",
   "title": "Vechio",
   "amountRequired": 256,
   "createdAt": "2019-05-19T18:53:41.424Z",
   "__v": 0
 },
 {
   "_id": "5ce1a59be07f26370cb8ec58",
   "title": "NewDeals3526",
   "amountRequired": 34343,
   "createdAt": "2019-05-19T18:51:07.016Z",
   "__v": 0
 },
 {
   "_id": "5ce1a3c55eb817558c804019",
   "title": "Update Deal",
   "amountRequired": 3652,
   "createdAt": "2019-05-19T18:43:17.192Z",
   "__v": 0
}]


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
