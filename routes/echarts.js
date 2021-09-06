var express=require("express")
var router=express.Router()
var model=require("../modules/model")

router.post('/',function (req,res,next) {
    var textno=req.query.textno;
    console.log(textno)
    var answerdata=[];
    model.connect(function (db,client) {
        db.collection('dataarrays').find({textno:textno}).toArray(function (err,ret) {
            if(err){
                console.log("dataarrays查询组成echarts失败!")
            }else{
                var userarrays=[];
                var fatherret=ret[0];
                db.collection("user").find().toArray(function (err,ret) {
                    if (err) {
                        console.log("出现了一些问题呢！");
                    } else {
                        userarrays=ret;
                        console.log("userarrays",userarrays)
                        console.log(fatherret)
                        console.log(userarrays)
                        for(var i=0;i<fatherret.authors.length;i++) {
                            for(var j=0;j<userarrays.length;j++){
                                if(userarrays[j].id===parseInt(fatherret.authors[i])){
                                    answerdata.push({value:fatherret.contributions[i],name:userarrays[j].nickname})
                                }
                            }
                        }
                        console.log("bjjkxhekwqjj",answerdata)
                        res.json(answerdata)
                    }
                })


            }
        })
    })
})



module.exports = router;