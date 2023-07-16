import rooms from "../../store/rooms";
import { end_game } from "../end_game";

export const pass = (io, roomID : string, token : string) => {
    if(!rooms[roomID]) return;
      const current_user = rooms[roomID].users.find(
        (user) => user.token === token
      );
      if(!current_user) return;
      const user = rooms[roomID].playing_list.find(
        (user) => user.username === current_user.username
      );
      if(!user) return;
      if(user.skipped) return;
      // if no points, can't skip
      if(user.points === 0) return;


      if(rooms[roomID].playing_list.length < 2) return;
      if(user.points < rooms[roomID].playing_list.filter((another) => another.username !== user.username)[0].points ){
        end_game(io, roomID);
        return;
      }
      rooms[roomID].turn = (rooms[roomID].turn + 1) % 2;
      io.to(roomID).emit("turn", rooms[roomID].turn);
      user.skipped = true;
      io.to(roomID).emit("playing_list", rooms[roomID].playing_list);
      if(rooms[roomID].playing_list.filter((user) => !user.skipped).length === 0){
        end_game(io, roomID);
      }
    }