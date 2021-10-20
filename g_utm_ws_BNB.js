//
// BINANCE web socket BNB_
// asset account
//
// @2020 Utomato_crypto
//

var WebSocketClient = require('websocket').client;
var mongoose = require('mongoose');

const crypto = require('crypto');

var baseAsset = 'USDT';
var asset = 'BNB';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/crypto', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

mongoose.connection.on('connected', function () {
    console.log('Connect OK... ');
    console.log(' ');
    });

var base = 'https://api.binance.com/';
var header = 'X-MBX-APIKEY';
var keys = { 
  "apiKey" : 'your ApiKey',
  "secretKey" : 'your secretKey'
}
var endPoint = 'api/v3/userDataStream';

getInfo();
                  function listenkey(){

                    return new Promise(function(resolve, reject){
                
                        var url = base + endPoint;
                        var ourRequest = new XMLHttpRequest();
                            ourRequest.open('POST', url, true);
                            ourRequest.setRequestHeader(header, keys['apiKey']);
                 
                            ourRequest.onload = function(){
                            lkx = JSON.parse(ourRequest.responseText);
                            resolve(lkx.listenKey);
                            console.log(lkx.listenKey);
                            }
                            ourRequest.send();
                      })
                     }

                     function websocketConnection(k){

                        return new Promise(function(resolve, reject){
                        var kj = k;
                        console.log(kj);

                //**  WEB SOCKET  **
                var client = new WebSocketClient();

                client.on('connectFailed', function(error) {
                    console.log('Connect Error: ' + error.toString());
                });
                
                client.on('connect', function(connection) {
                    console.log('WebSocket Client Connected');
                    connection.on('error', function(error) {
                        console.log("Connection Error: " + error.toString());
                        setTimeout(function() {
                            websocketConnection(kj);
                          }, 5000);
                    });

                    connection.on('close', function() {
                        console.log('echo-protocol Connection Closed');
                    });
                    connection.on('message', function(message) {
                        if (message.type === 'utf8') {
                            console.log("Received: '" + message.utf8Data + "'");
                            var x = JSON.parse(message.utf8Data);
                                console.log(x);
                                console.log(x.data.e);
                            if (x.data.e == 'outboundAccountPosition') {
                               console.log(x.data.B.length);
                               console.log(x.data.B);
                               for (let i = 0; i < x.data.B.length; i++) {
                                if (x.data.B[i].a == baseAsset) {
                                    console.log('available:', baseAsset,x.data.B[i].f);
                                    xAsset = baseAsset;
                                    xValue = x.data.B[i].f;
                                    saveUserAccount(xAsset, xValue, db);
                                    resolve(x.data.B[i].f);
                                 }   
                                 if (x.data.B[i].a == asset) {
                                     console.log('available:', asset, x.data.B[i].f);
                                     xAsset = asset;
                                     xValue = x.data.B[i].f;
                                     saveUserAccount(xAsset, xValue, db);
                                 }     
                               }
                            }
                        }
                    });
                }); 

                if (k == undefined ) {
                    console.log('NO KEY VALUE !! ');
                }
                else {
                     console.log('LISTENKEY: ',k);
                     client.connect('wss://stream.binance.com:9443/stream?streams='+k+'/outboundAccountPosition');
                              }
                          })
                         }

                   function resultInfo(w){
                    console.log(w);
                   }      
                

                  async function getInfo(){

                    try{
                        const lk = await listenkey();
                        const ws = await websocketConnection(lk);
                        const resultK = await  resultInfo(ws);
                           
                    }
                    catch (err){
                        console.log(err);
                        }
                  }

 // SAVE ACCOUNT 
var saveUserAccount = function(assetx, accountValue, db, callback){
    var saveAccount = require('./assetAccount_model_BNB.js');
    var unix = Math.round(+new Date()/1000);
  
    var save_account= new saveAccount({
      timestamp: unix,           // data
      asset: assetx,             // asset
      assetValue: accountValue,  // assetValue
    });
  
    save_account.save(function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Save ACCOUNT');
        }
    })
  }

