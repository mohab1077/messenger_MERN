import mongoose, { Schema, Document } from "mongoose";



export interface Iuser extends Document{
    email:string,
    password:string,
    username:string
}

const  userschema = new Schema<Iuser> ({
 email:{type:String , required: true},
 password:{type:String , required: true},
 username:{type:String , required: true}

})


export const usermodel = mongoose.model<Iuser>("user", userschema)


