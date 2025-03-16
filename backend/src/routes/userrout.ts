
import express from "express"
import { loginserver, rigesterservc } from "../servic/userserver";
const router = express.Router();

router.post("/rigester",async(req , res)=>{
  const {email , password,username} = req.body
  const {status , msg} = await  rigesterservc({email , password,username})
  res.status(status).json(msg)
})


router.post("/login",async(req , res)=>{
    const {email , password} = req.body
    const {status , msg} = await  loginserver({email , password})
    res.status(status).json(msg)
  })





export default router;



