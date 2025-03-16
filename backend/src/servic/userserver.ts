import bcrypt from "bcrypt";
import { usermodel } from "../modules/user";
import jwt from "jsonwebtoken";

export interface props {
  email: string;
  password: string;
  username: string;
}

export const rigesterservc = async ({ email, password, username }: props) => {
  const finduser = await usermodel.findOne({ email });
  if (finduser) {
    return { msg: "email is already here", status: 400 };
  }
  const findusername = await usermodel.findOne({ username });

  if (findusername) {
    return { msg: "username is already here", status: 400 };
  }

  const hashpass = await bcrypt.hash(password, 10);
  const msg = await usermodel.create({ email, username, password: hashpass });
 
  return ({status: 200, msg: chang({email}) });
};

export interface login {
  email: string;
  password: string;
  
}


export const loginserver = async ({email , password }:login)=>{
const finduser = await usermodel.findOne({email})
if(!finduser){
  return { msg: "email not found", status: 400 };
}
const pass = await bcrypt.compare(password,finduser.password)
if(!pass){
  return { msg: "pass wrong", status: 400 };
}


return ({status: 200, msg: chang({email}) });
}







const chang = (data:any)=>{
    return jwt.sign(data,process.env.jwtpass || '')
  }
