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

routerApi.post('/deal/addDeal', async (req, res) => {
    const deal =  new db()
    // const id= new mongoose.Types.ObjectId()
    console.log('id ', deal)
    return
    deal.id=id
    deal.title=req.body.dealName
    deal.amount=req.body.dealAmount
    console.log(deal)
    console.log('hello post',req.body)
    
    deal.save()
     .then(deal=>console.log(deal))
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
