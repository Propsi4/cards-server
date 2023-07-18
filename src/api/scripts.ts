import rooms from "../store/rooms";
import { encrypt, decrypt } from "../utils/utils";
import { getUsernamefromToken } from "./../utils/utils";

const validateUsername = (username) => {
  if (username.length < 3 || username.length > 10) {
    return false;
  }
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(username);
};

export const createRoom = (req, res) => {
  const roomID = Date.now().toString().slice(9);
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  rooms[roomID] = {
    messages: [],
    users: [],
    typing: [],
    playing_list: [],
    turn: 0,
    unused_cards: [],
    clear_on_end: true,
    owner : {token : token, username : getUsernamefromToken(token)}
  };
  res.json({ roomID: roomID });
};

export const canJoin = (req, res) => {
  const { roomID, username, token } = req.body;
  if (!rooms[roomID]) {
    res.json({ canJoin: false });
  } else {
    try {
      const user = rooms[roomID].users.find(
        (user) => user.username === username
      );
      if (user?.username === username && user?.token !== token) {
        res.json({ canJoin: false });
      } else {
        res.json({ canJoin: true });
      }
    } catch (e) {
      res.json({ error: "Invalid request body" });
    }
  }
};

export const getToken = (req, res) => {
  const { username } = req.body;
  if(!validateUsername(username)){
    res.status(400).json({ error: "Invalid username" });
    return;
  }
  const token = encrypt({ username: username, time: Date.now() });
  res.json({ token: token });
};
export const getUsername = (req, res) => {
  const { token } = req.body;
  const data = decrypt(token);
  if (!data) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
  const username = JSON.parse(data).username;
  res.json({ username: username });
};
export const joinRoom = (req, res) => {
  const { roomID, token } = req.body;
  const username = getUsernamefromToken(token);
  if (!username) {
    res.status(400).json({ error: "Invalid token" });
    return;
  }
  if (!rooms[roomID]) {
    res.json({ message: "Room not found" });
  } else {
    try {
      const user = rooms[roomID].users.find((user) => user.username === username);
      if (user) {
        if (user.username === username && user.token !== token) {
          res.status(400).json({ error: "Username already taken" });
          return;
        } 
      }
      else {
          rooms[roomID].users.push({ username: username, socketID: "", token: token });
        }
        res.json({ username: username });
      }catch (e) {
      res.status(400).json({ error: "Invalid request body" });
    }
  }
};
export const users = (req, res) => {
  const { roomID } = req.body;
  if (!rooms[roomID]) {
    res.json({ message: "Room not found" });
  } else {
    try {
      res.json({ users: rooms[roomID].users.map((user) => user.username) });
    } catch (e) {
      res.json({ error: "Invalid request body" });
    }
  }
};
export const getRooms = (req, res) => {
  // return number of players and roomID
  // Object.keys(rooms).forEach((roomID) => {
  //   return { roomID: roomID, users: rooms[roomID].users.length };
  // });

  res.json(
    Object.keys(rooms).map((roomID) => {
      return { roomID: roomID, users: rooms[roomID].users.length };
    }
  ));
  }
