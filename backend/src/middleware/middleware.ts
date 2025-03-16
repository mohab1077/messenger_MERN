import { NextFunction, Response , Request } from "express";
import jwt from "jsonwebtoken";
import { usermodel } from "../modules/user";




export interface reb extends Request{
user?:any
}

const middlware = (req:reb , res : Response , next : NextFunction)=>{
    const authorizationHeader = req.get("authorization");
    if(!authorizationHeader){
         res.status(400).send("no auth")
         return
    }

    const token = authorizationHeader.split(" ")[1]
    if(!token){
        res.status(400).send("no token")
        return
    }
    jwt.verify(token,process.env.jwtpass || '',async(err,payload)=>{

        if(err){
             res.status(400).send("something wrong")
             return
        }
        if(!payload){
            res.status(400).send("no payload")
            return
        }
        
        const userPayload = payload as {
            email: string;
            name:string
          };
        const usera = await usermodel.findOne({email:userPayload.email})
        req.user = usera
        next()

    })

}
export default middlware