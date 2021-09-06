var express = require("express")
var router = express.Router()
var model=require("../modules/model")



router.get('/showarticle',function (req,res,next) {
    console.log("已经进来了")
    var data={
        textno:"",
        content:"",
    }
    data.textno=req.query.thetitle;
    model.connect(function (db) {
        db.collection("article").find({textno:data.textno}).toArray(function (err,ret) {
            if(err){
                console.log("查找文章失败！")
            }else{
                console.log("查找展示文章成功！")
                data=ret[0];
                res.render("checkarticle",{data:data})
            }
        })




    })

})

module.exports=router