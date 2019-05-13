const express= require('express');

const routerApi = express.Router();

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
        db.find().exec(function(err, result) {
            console.log('result ', result)
            res.send(result);
        });
    }
    
});

routerApi.get(`/deal/:id`, async (req, res) => {
    const {id} = req.params
    db.findById(id).exec(function(err, result) {
        res.send(result);
    });
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
        console.log('result ', result)
        res.send(result)
    })
    
});



module.exports= routerApi;
