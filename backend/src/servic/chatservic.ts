import { chatModel } from "../modules/chats";
import { usermodel } from "../modules/user";

interface msgg {
  myuser: string;
  data: string;
  username: string;
}

export const sendmsg = async ({ myuser, data, username }: msgg) => {
  const findmyuser = await usermodel.findById(myuser);
  if (!findmyuser) {
    return { status: 400, msg: "error" };
  }
  const myusername = findmyuser.username;
  const findotheruser = await usermodel.findOne({ username });
  if (!findotheruser) {
    return { status: 400, msg: "username not found" };
  }
  let usernames = [myusername, username];
  let findchat = await chatModel.findOne({ usernames: usernames });

  usernames = [username, myusername];
  if (!findchat) {
    findchat = await chatModel.findOne({ usernames: usernames });
  }

  if (!findchat) {
    findchat = await chatModel.create({ usernames });
  }
  findchat.msg.push({ user: myusername, msg: data });
  findchat.save();
  return { status: 200, msg: findchat.msg };
};

interface show {
  username: string;
  myuser: string;
}
export const showchat = async ({ username, myuser }: show) => {
  const findmyuser = await usermodel.findById(myuser);
  if (!findmyuser) {
    return { status: 400, msg: "error" };
  }
  const myusername = findmyuser.username;
  const findotheruser = await usermodel.findOne({ username });
  if (!findotheruser) {
    return { status: 400, msg: "username not found" };
  }
  let usernames = [myusername, username];
  let findchat = await chatModel.findOne({ usernames: usernames });

  usernames = [username, myusername];
  if (!findchat) {
    findchat = await chatModel.findOne({ usernames: usernames });
  }

  if (!findchat) {
    findchat = await chatModel.create({ usernames });
  }
  
  return { status: 200, msg: findchat.msg };
};


export const delchat =async ({ username, myuser }: show)=>{
    const findmyuser = await usermodel.findById(myuser);
    if (!findmyuser) {
      return { status: 400, msg: "error" };
    }
    const myusername = findmyuser.username;
    const findotheruser = await usermodel.findOne({ username });
    if (!findotheruser) {
      return { status: 400, msg: "username not found" };
    }
    let usernames = [myusername, username];
    let findchat = await chatModel.findOne({ usernames: usernames });
  
    usernames = [username, myusername];
    if (!findchat) {
      findchat = await chatModel.findOne({ usernames: usernames });
    }
  
    if (!findchat) {
      findchat = await chatModel.create({ usernames });
    }
    findchat.msg = []
    findchat.save();
    return { status: 200, msg: findchat.msg };
}

interface del {
    username: string,
    myuser: string,
    _id:string
  }
export const delmsg  = async({username,myuser,_id}:del)=>{
    const findmyuser = await usermodel.findById(myuser);
    if (!findmyuser) {
      return { status: 400, msg: "error1" };
    }
    const myusername = findmyuser.username;
    const findotheruser = await usermodel.findOne({ username });
    if (!findotheruser) {
      return { status: 400, msg: "username not found" };
    }
    let usernames = [myusername, username];
    let findchat = await chatModel.findOne({ usernames: usernames });
  
    usernames = [username, myusername];
    if (!findchat) {
      findchat = await chatModel.findOne({ usernames: usernames });
    }
    if(!findchat){
        return { status: 400, msg: "error2" };
    }
    
    findchat.msg = findchat?.msg.filter(p => (p as any)._id.toString() !== _id);
    
    await findchat.save()
    return { status: 200, msg: findchat.msg };
}

interface getmyu{
  myuser: string
}
export const getmyuser = async({myuser}:getmyu)=>{
  const findmyuser = await usermodel.findById(myuser);
  if (!findmyuser) {
    return { status: 400, msg: "error" };
  }
  return{status:200 , msg:findmyuser.username}
}
