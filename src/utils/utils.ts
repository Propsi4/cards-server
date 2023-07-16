import CryptoJS from "crypto-js";
import { CardType, UsersPlayingType } from "../types/types";
import { json } from "express";
export const encrypt = (data) => {
  const passphrase = "123";
  if(data.username.length < 3 || data.username.length > 10 ) return null;
  try{
    const token = CryptoJS.AES.encrypt(JSON.stringify(data), passphrase).toString()
    return token;
  }catch(e){
    return null;
    }

};

export const decrypt = (ciphertext) => {
  if(!ciphertext) return null;
  const passphrase = "123";
  try{
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if(JSON.parse(originalText).username.length < 3 || JSON.parse(originalText).username.length > 10 ) return null;
  return originalText;
  }catch(e){
    return null;
  }
};

export const getUsernamefromToken = (token) => {
  let data = decrypt(token);
  if (!data) {
    return null;
  }
  data = JSON.parse(data);

  return data.username;

};

