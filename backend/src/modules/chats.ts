import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface Imsg{
    user:string,
    msg:string
    
}

export interface Ichat extends Document{
    usernames:string[],
    msg:Imsg[]
}


const msgchema = new Schema<Imsg>({
 user:{type:String, required:true},
 msg:{type:String, required:true}
})
const chatchema = new Schema<Ichat>({
    usernames:[String],
    msg:[msgchema]

})

export const chatModel = mongoose.model<Ichat>("chat", chatchema);

