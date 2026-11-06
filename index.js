const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const ADMIN_PWD = "admin123456";

let userQuota = {};

app.get('/quota', (req,res)=>{
  const uid = req.query.uid;
  if(!uid) return res.json({code:-1,msg:"缺少用户标识"});
  if(!userQuota[uid]){
    userQuota[uid] = {free:3,ad:0,invite:0};
  }
  res.json({code:0,data:userQuota[uid]});
})

app.post('/ad',(req,res)=>{
  const {uid} = req.body;
  if(!uid) return res.json({code:-1});
  if(!userQuota[uid]) userQuota[uid]={free:3,ad:0,invite:0};
  userQuota[uid].ad +=1;
  res.json({code:0,data:userQuota[uid]});
})

app.post('/invite',(req,res)=>{
  const {uid} = req.body;
  if(!uid) return res.json({code:-1});
  if(!userQuota[uid]) userQuota[uid]={free:3,ad:0,invite:0};
  userQuota[uid].invite +=3;
  res.json({code:0,data:userQuota[uid]});
})

app.post('/use',(req,res)=>{
  const {uid} = req.body;
  if(!uid) return res.json({code:-1});
  if(!userQuota[uid]) userQuota[uid]={free:3,ad:0,invite:0};
  let item = userQuota[uid];
  let total = item.free + item.ad + item.invite;
  if(total <=0) return res.json({code:-2,msg:"额度用完，看广告或者注册新平台解锁"});
  if(item.free>0) item.free--;
  else if(item.ad>0) item.ad--;
  else item.invite--;
  res.json({code:0,data:userQuota[uid]});
})

app.post('/admin-check',(req,res)=>{
  const {pwd} = req.body;
  if(pwd === ADMIN_PWD){
    return res.json({code:0,isAdmin:true})
  }
  res.json({code:-1,isAdmin:false})
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
  console.log("剧创宝后端启动，端口："+port)
})
