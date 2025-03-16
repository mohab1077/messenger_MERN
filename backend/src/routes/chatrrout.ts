
import express from "express"
import middlware, { reb } from "../middleware/middleware";
import { delchat, delmsg, getmyuser, sendmsg, showchat } from "../servic/chatservic";


const router = express.Router();


router.post("/",middlware , async(req:reb , res)=>{
    const myuser = req?.user?._id
    const {data,username,time} = req.body
    const {status , msg} = await sendmsg({myuser,data,username,time})
    res.status(status).json(msg)
    
   
})


router.put("/",middlware , async(req:reb , res)=>{
    const myuser = req?.user?._id
    const {username} = req.body
    const {status , msg} = await showchat({myuser,username})
    res.status(status).json(msg)
    
   
})
router.delete("/",middlware , async(req:reb , res)=>{
    const myuser = req?.user?._id
    const {username} = req.body
    const {status , msg} = await delchat({myuser,username})
    res.status(status).json(msg)
    
   
})

router.delete("/msg",middlware , async(req:reb , res)=>{
    const myuser = req?.user?._id
    const {username,_id} = req.body
    const {status , msg} = await delmsg({myuser,username,_id})
    res.status(status).json(msg)
    
   
})

router.get("/myuser",middlware , async(req:reb , res)=>{
    const myuser = req?.user?._id
    const {status , msg} = await getmyuser({myuser})
    res.status(status).json(msg)
    
   
})




//deletemsg






export default router;