import rooms from "../../store/rooms";
import { end_game } from "../end_game";

export const leave_seat = (io, roomID : string, token : string) => {
    if (!rooms[roomID]) return;
    const current_user = rooms[roomID].users.find(
      (user) => user.token === token
    );
    if (!current_user) return;
    // if game was started and left then announce winner
    const user = rooms[roomID].playing_list.find(
      (user) => user.username === current_user.username
    );
    if (!user) return
      // if someone left while playing, announce winner
      // if anyone have points
      if(rooms[roomID].playing_list.filter((user) => user.points > 0).length){
        end_game(io, roomID);
      }
    

    rooms[roomID].playing_list = rooms[roomID].playing_list.filter(
      (user) => user.username !== current_user.username
    );
    io.to(roomID).emit("playing_list", rooms[roomID].playing_list);
}