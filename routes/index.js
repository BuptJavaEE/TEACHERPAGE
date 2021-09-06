var express = require("express")
var router = express.Router()
var model=require('../modules/model')
// import express from "express";

router.get('/',function (req,res,next) {
    res.render('index',{})
})

router.get('/test',function (req,res,next) {
    res.render('show',{})
})

router.get('/teacherpage',function (req,res,next) {
    var data={
        teacher:"已发布的全体文章列表:",
        thename:req.query.name,
        articlelist:[],
        grouplist:[],
        users:[]
    };
    let arrays=[];
    model.connect(function (db) {
        db.collection("article").find().toArray(function (err,ret) {            //读取所有现存文章列表
            if(err){
                console.log("读取文章出错了!")
            }else{
                console.log("读取文章成功!")
                data.articlelist=ret;
                data.grouplist=ret;
                db.collection("group").find().toArray(function (err,ret) {      //读取所有现存小组列表
                    if(err){
                        console.log("出错了!")
                    }else{
                        db.collection("user").find().toArray(function (err,ret) {   //读取所有的用户列表的信息
                            if(err){
                                console.log("读取用户列表出错了!");
                            }else{

                                data.users=ret;
                                res.render("teacher",{data:data});
                            }
                        })
                    }
                }
                )

            }
        })
    })

})




module.exports=router
// export default router;
