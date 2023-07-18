import rooms from "../../store/rooms";
import { left_room } from "./left_room";

export const alive = (io,socket, roomID : string, token : string) => {
    if (!rooms[roomID]) return;
      const current_user = rooms[roomID].users.find(
        (user) => user.token === token
      );
      if (!current_user) return;
      clearTimeout(current_user.alive_timeout);
      current_user.alive_timeout = setTimeout(() => {
        left_room(io, socket, roomID, current_user.socketID);
      }, 10000);
    }