
import mongoose, { Schema, Document ,ObjectId} from "mongoose";
import { Iuser } from "./user";

const enu = ["confirmed","inprograss","request"]
export interface Ifriendstatus{
    userfr:any,
    statusfr:"inprograss"|"confirmed"|"request"
}

export interface Ifriend extends Document{
 myuser:Iuser,
 friends:Ifriendstatus[]
}

const frinedchema = new Schema<Ifriendstatus>({
  userfr:{type:  String,required: true  },
  statusfr: { type: String, enum: enu, default: "inprograss"}
})


const friendschema = new Schema<Ifriend>({
    myuser:{type: Schema.Types.ObjectId , ref:"user" , required: true},
    friends: [frinedchema]
})

export const FriendModel = mongoose.model<Ifriend>("friends", friendschema);