import mongoose from "mongoose";
import { FriendModel } from "../modules/friends";
import { usermodel } from "../modules/user";

interface getfr {
  myuser: string;
}
export const getfriends = async ({ myuser }: getfr) => {
  const findfr = await FriendModel.findOne({ myuser });
  if (!findfr) {
    const msg = await FriendModel.create({ myuser });
    msg.save();
    return { msg: msg.friends, status: 201 };
  }
  return { msg: findfr.friends, status: 200 };
};

interface addfriendss {
  myuser: string;
  username: string;
}

export const addfriends = async ({ myuser, username }: addfriendss) => {
  let findfr = await FriendModel.findOne({ myuser });
  if (!findfr) {
    findfr = await FriendModel.create({ myuser });
  }

  const findusername = await usermodel.findOne({ username });
  if (!findusername) {
    return { status: 400, msg: "username not found" };
  }
  let findsecondfr = await FriendModel.findOne({ myuser: findusername });

  if (!findsecondfr) {
    findsecondfr = await FriendModel.create({ myuser: findusername });
  }

  const isAfriend = findfr?.friends.find((p) => {
    if (p.userfr == findusername.username) {
      return true;
    }
  });

  if (isAfriend) {
    return { status: 400, msg: "already friend or already sent requst" };
  }

  findfr?.friends.push({
    userfr: findusername.username,
    statusfr: "inprograss",
  });

  const foundotherusername = await usermodel.findById(findfr.myuser);

  findsecondfr?.friends.push({
    userfr: foundotherusername?.username,
    statusfr: "request",
  });
  await findfr.save();
  await findsecondfr.save();

  return { status: 200, msg: findfr?.friends };
};

export const acceptfriends = async ({ myuser, username }: addfriendss) => {
  let findfr = await FriendModel.findOne({ myuser });
  if (!findfr) {
    findfr = await FriendModel.create({ myuser });
  }

  const findusername = await usermodel.findOne({ username });
  if (!findusername) {
    return { status: 400, msg: "username not found" };
  }
  let findsecondfr = await FriendModel.findOne({ myuser: findusername });

  if (!findsecondfr) {
    findsecondfr = await FriendModel.create({ myuser: findusername });
  }

  findfr?.friends.find((p) => {
    if (p.userfr == findusername.username) {
      p.statusfr = "confirmed";
    }
  });
  const foundotherusername = await usermodel.findById(findfr.myuser);
  findsecondfr?.friends.find((p) => {
    if (p.userfr == foundotherusername?.username) {
      p.statusfr = "confirmed";
    }
  });
  await findsecondfr.save();
  await findfr.save();
  return { msg: "we are friends now", status: 200 };
};

export const delfriends = async ({ myuser, username }: addfriendss) => {
  let findfr = await FriendModel.findOne({ myuser });
  if (!findfr) {
    findfr = await FriendModel.create({ myuser });
  }

  const findusername = await usermodel.findOne({ username });
  if (!findusername) {
    return { status: 400, msg: "username not found" };
  }
  let findsecondfr = await FriendModel.findOne({ myuser: findusername });

  if (!findsecondfr) {
    findsecondfr = await FriendModel.create({ myuser: findusername });
  }

  const isAfriend = findfr?.friends.find((p) => {
    if (p.userfr == findusername.username) {
      return true;
    }
  });

  if (!isAfriend) {
    return { status: 400, msg: "he is not friend to delete" };
  }

  const newfr = findfr?.friends.filter(p=> p.userfr !== findusername.username )
  findfr.friends = newfr
  const foundotherusername = await usermodel.findById(findfr.myuser);
  const newfr2 = findsecondfr?.friends.filter(p=> p.userfr !== foundotherusername?.username )
  findsecondfr.friends = newfr2
  await findsecondfr.save();
  await findfr.save();
  return { msg: "has been deleted", status: 200 };

};
