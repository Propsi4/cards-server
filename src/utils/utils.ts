import CryptoJS from "crypto-js";
import { CardType, UsersPlayingType } from "../types/types";
export const encrypt = (data) => {
  const passphrase = "123";
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
export const isEquivalent = (a: CardType, b: CardType) => {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false;
  }
  
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  // If we made it this far, objects
  // are considered equivalent
  return true;
}
export const getNeighbours = (playing_list : UsersPlayingType[], seat : number) => {
  seat = (seat + 1) % length;
  let left = seat - 1;
  let right = seat + 1;
  if (left < 0) left = length - 1;
  if (right > length - 1) right = 0;
  return {left : left, right : right, defender : seat};
}