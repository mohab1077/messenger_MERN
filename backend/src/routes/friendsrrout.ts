import express from "express"
import middlware, { reb } from "../middleware/middleware";
import { acceptfriends, addfriends, delfriends, getfriends } from "../servic/friendserveic";


const router = express.Router();


router.get("/get",middlware , async(req:reb , res)=>{
    const myuser = req?.user?._id
    const {status , msg} = await getfriends({myuser})
    res.status(status).json(msg)
    
   
})


router.post("/add",middlware , async(req:reb , res)=>{
    const myuser = req?.user?._id
    const {username} = req.body
    const {status , msg} = await addfriends({myuser,username})
    res.status(status).json(msg)
    
   
   
})


router.post("/accept",middlware , async(req:reb , res)=>{
    const myuser = req?.user?._id
    const {username} = req.body
    const {status , msg} = await acceptfriends({myuser,username})
    res.status(status).json(msg)
    
   
   
})
router.delete("/delete",middlware , async(req:reb , res)=>{
    const myuser = req?.user?._id
    const {username} = req.body
    const {status , msg} = await delfriends({myuser,username})
    res.status(status).json(msg)
    
   
   
})





//deletefriend
//


export default router;
