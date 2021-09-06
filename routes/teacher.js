var express = require("express");
var router=express.Router();
var model = require("../modules/model")
// import model from "../modules/model"
// import express from "express";
/*行为：
表名：dataarrays:
          textno:
          authors:[]
          talks:[]  //.记录交流的次数
          logintimes:[] //.记录登录的次数
社交：
表名：social:
          textno:
          authors:[]
          totaltimes:[]  //.记录这个作者一共交流过多少
          connections:[]  //.记录一共有多少条交流线
          connecttimes:[] //.记录交流线交流过几次
          */

var datatotal={};
router.post("/submitdata",function (req,res,next) {             //教师添加写作和学生的相关信息的函数
    // var teacherno=document.getElementById("teacherno").value

    let groupid=req.body.groupid;
    let thedata=req.body.boxes;
    let groupleader=req.body.userno;

    console.log("thedata的长度是",thedata.length,thedata[0],thedata[1])
    model.connect(function (db,client) {
        db.collection("user").find({username:groupleader}).toArray(function (err,ret) {
            if(err){
                console.log("出错了");
            }else{
                groupleader=ret[0].id;
                for(var i=0;i<thedata.length;i++){
                    db.collection("group").insertOne({groupid:groupid,groupleader:groupleader,id:parseInt(thedata[i])},function (err) {
                        if(err){
                            console.log("插入失败!")
                        }else{
                            console.log("插入成功!")
                        }
                    })
                }
            }
        })

    })

    var data={
        textno:req.body.textno,
        userno:req.body.userno,
        groupid:req.body.groupid,
        groupmembers:req.body.boxes,
        textname:req.body.textname
    }
    var successflag=0;                      //用于检验数据是否插入成功
    var authors=[];                         //用于记录小组中的成员
    var contributions=[];                   //记录修改次数的数组
    model.connect(function (db) {   //模型连接数据库

        /*这部分代码主要是为了把小组的信息保存进dataarrays完成dataarrays的初始化*/

                for(var i=0;i<data.groupmembers.length;i++){
                    authors.push(data.groupmembers[i]);
                    contributions.push(0);
                }
                //插入文章的函数
                db.collection("dataarrays").insertOne({textno:data.textno,authors:authors,contributions:contributions},function (err) {
                    if(err){
                        console.log("dataarrays插入失败!",err)
                    }else{
                        console.log("dataarrays插入成功!")
                        db.collection("article").insertOne({textno:data.textno,text:" ",textname:data.textname,groupid:data.groupid},function (err) {
                            if(err){
                                console.log("文章插入失败!",err)
                            }else{
                                console.log("文章插入成功!")
                            }
                        })
                        res.redirect("/createarticle/createarticle?teacherno="+data.userno+"&title="+data.textno)
                    }
                })


    })
    /*跳转到相应的页面*/
})




module.exports=router;
// export default router;






































































































































