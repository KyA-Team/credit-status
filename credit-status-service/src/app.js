const express = require('express')
const riskStatusService = require('./riskStatusService')
const app = express()
const bodyParser = require('body-parser'); //Parse JSON in request body
const authentication = require('./authentication')

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Nothing goes here'))

app.get('/riskStatus/multipleQuery', function (req, res){
    res.status(400).send('You should be using POST')
})

app.get('/riskStatus', function (req, res){
    res.status(400).send('You need to add a CUIL for this to work')
})

app.post('/riskStatus/multipleQuery', authentication.parseKey,  async function (req, res){
    const ids = req.body;
    if ( !Array.isArray(ids) ){
        res.status(400).json({status: "Invalid request"})
        return;
    }

    //TODO: Don't send the ids length, remove duplicates first
    const hasQuota = await authentication.hasQuota(ids.length,res);
    if ( !hasQuota ){
        return
    }

    riskStatusService.getCreditStatus(ids).then(creditStatus  => {
        if (creditStatus.length)
            res.json(creditStatus)
        else{
            res.status(404).json([])
        }
    }).catch(reason => { res.status(500).json({}); throw reason });
});

app.get('/riskStatus/:id(\\d+)', authentication.parseKey, function (req, res){
    let id = req.params['id']
    riskStatusService.getCreditStatus([id]).then(creditStatus  => {
        if (creditStatus.length)
            res.json(creditStatus)
        else{
            res.status(404).json({})
        }
    });
})

app.get('/break', function (req, res){
    throw "Forced error for testing"
})

app.use(function(req, res, next){
    res.status(404).send('The page you are looking for does not exist');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Oh no, the app just had an error!');
  });

module.exports = app;