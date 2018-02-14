const express = require('express')
const app = express()
const http = require('http');
const https = require('https');
const parseString = require('xml2js').parseString;

const apikey = '&apikey=7LCPKDNO8XAWV64J';

app.get('/api/options', function(req,res){
    var symbol = req.query["symbol"]
    http.get('http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input='+symbol, (resp)=>{
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
          });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.setHeader('Access-Control-Allow-Origin','*');
            if(data != undefined)
            res.json(JSON.parse(data));
            else
            res.json([]);
        });
        
    })
    
});

app.get('/api/data', function(req, res){
    var symbol = req.query["symbol"];
    var func = req.query["function"];
    if(func === "Price"){
        https.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol='+symbol+apikey, (resp)=>{
            let data = '';
            resp.on('data', (chunk)=>{
                data += chunk;
            });
            resp.on('end', ()=>{
                res.setHeader('Access-Control-Allow-Origin','*');
                if(data != undefined)
                res.json(JSON.parse(data));
                else
                res.json([]);
            })
        })
    }
    else if(func === "STOCH"){
        https.get('https://www.alphavantage.co/query?function='+func+'&symbol='+symbol+'&interval=daily&time_period=10&series_type=open&slowkmatype=1&slowdmatype=1'+apikey, (resp)=>{
            let data = '';
            resp.on('data', (chunk)=>{
                data += chunk;
            });
            resp.on('end', ()=>{
                res.setHeader('Access-Control-Allow-Origin','*');
                if(data != undefined)
                res.json(JSON.parse(data));
                else
                res.json([]);
            })
        })
    }
    else if(func === "BBANDS"){
        https.get('https://www.alphavantage.co/query?function='+func+'&symbol='+symbol+'&interval=daily&time_period=5&series_type=open&nbdevup=3&nbdevdn=3'+apikey, (resp)=>{
            let data = '';
            resp.on('data', (chunk)=>{
                data += chunk;
            });
            resp.on('end', ()=>{
                res.setHeader('Access-Control-Allow-Origin','*');
                if(data != undefined)
                res.json(JSON.parse(data));
                else
                res.json([]);
            })
        })
    }
    else if(func === "NEWS"){
        https.get('https://seekingalpha.com/api/sa/combined/'+symbol+'.xml', (resp)=>{
            let data = '';
            resp.on('data', (chunk)=>{
                data += chunk;
            });
            resp.on('end', ()=>{
                parseString(data, function (err, result) {
                    data = JSON.stringify(result);
                });
                res.setHeader('Access-Control-Allow-Origin','*');
                if(data != undefined)
                res.json(JSON.parse(data));
                else
                res.json([]);
            })
        })
    }
    else{
        https.get('https://www.alphavantage.co/query?function='+func+'&symbol='+symbol+'&interval=daily&time_period=10&series_type=close'+apikey, (resp)=>{
            let data = '';
            resp.on('data', (chunk)=>{
                data += chunk;
            });
            resp.on('end', ()=>{
                res.setHeader('Access-Control-Allow-Origin','*');
                if(data != undefined)
                res.json(JSON.parse(data));
                else
                res.json([]);
            })
        })
    }
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))