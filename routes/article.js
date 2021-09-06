let richText = require('rich-text');
let ShareDB = require('sharedb');
const db=require("sharedb-mongo")("mongodb://47.94.108.20:27017/littleterm");
const backend = new ShareDB({db});        //创建sharedb数据库
ShareDB.types.register(richText.type);
var WebSocket = require('ws');
var express = require("express")
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var router = express.Router()
var http = require('http');
// import richText from "rich-text";
// import ShareDB from "sharedb";
// import express from "express";
// import http from 'http';
// import WebSocket from 'ws';
// import WebSocketJSONStream from '@teamwork/websocket-json-stream';

let wss=null


router.get('/',function (req,res,next) {

})
/*从文章的一开始就直接把websocket创建并且打开*/
let app = express();
app.use(express.static('static'));
app.use(express.static('node_modules/quill/dist'));
let server = http.createServer(app);
// Connect any incoming WebSocket connection to ShareDB
wss = new WebSocket.Server({server: server});
wss.on('connection', function(ws) {
    let stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
});
server.listen(8085);
console.log("这是创建的数据库",backend)
console.log('The sharedbserver Listening on http://localhost:8085');



router.get('/createarticle',function(req,res,next){
    let teacherno=req.query.teacherno
    console.log("已经进入该方法了！")
    var articlename = req.query.title;
    console.log(articlename);
    createDoc(startServer,articlename)
// Create initial document then fire callback
    function createDoc(callback,article) {
        let connection = backend.connect();             //sharedb连接到端口
        var id=""+article;
        let doc = connection.get('examples', id);   //让doc获取sharedb数据库的example连接中的test-doc文档
        doc.fetch(function (err) {           //获取文档中的数据但是不会触发事件啥的
            if (err) throw err;
            if (doc.type === null) {          //如果当前文档是空的，也就是没有数值的话；会创建一个新的文档
                if(!wss) {
                    doc.create([], 'rich-text', callback);
                    return;
                }else{
                    doc.create([], 'rich-text')
                }
            }else {
                callback();
            }
        });
    }


    function startServer() {
        // Create a web server to serve files and listen to WebSocket connections

    }

    res.redirect("/teacherpage?name="+teacherno)

})




module.exports=router;


// router.get('/',function (req,res,next) {
//
// })
//
// let wss=null
// router.get('/createarticle',function(req,res,next){
//     let teacherno=req.query.teacherno
//     console.log("已经进入该方法了！")
//     var articlename = req.query.title;
//     console.log(articlename);
//     createDoc(startServer,articlename)
// // Create initial document then fire callback
//     function createDoc(callback,article) {
//         let connection = backend.connect();             //sharedb连接到端口
//         var id=""+article;
//         let doc = connection.get('examples', id);   //让doc获取sharedb数据库的example连接中的test-doc文档
//         console.log(doc)
//         doc.fetch(function (err) {           //获取文档中的数据但是不会触发事件啥的
//             if (err) throw err;
//             if (doc.type === null) {          //如果当前文档是空的，也就是没有数值的话；会创建一个新的文档
//                 if(!wss) {
//                     doc.create([], 'rich-text', callback);
//                     return;
//                 }else{
//                     doc.create([], 'rich-text')
//
//                 }
//             }else {
//                 callback();
//             }
//         });
//     }
//
//
//     function startServer() {
//         // Create a web server to serve files and listen to WebSocket connections
//         let app = express();
//         app.use(express.static('static'));
//         app.use(express.static('node_modules/quill/dist'));
//         let server = http.createServer(app);
//
//         // Connect any incoming WebSocket connection to ShareDB
//         wss = new WebSocket.Server({server: server});
//         wss.on('connection', function(ws) {
//             let stream = new WebSocketJSONStream(ws);
//             backend.listen(stream);
//         });
//
//         server.listen(8085);
//         console.log('The sharedbserver Listening on http://localhost:8085');
//     }
//
//     res.redirect("/teacherpage?name="+teacherno)
//
// })
//
//
//
//
// module.exports=router;
// export default router;