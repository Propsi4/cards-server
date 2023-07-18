import rooms from "../../store/rooms";
import { end_game } from "../end_game";
export const left_room = (io, socket, roomID : string, socketID : string) => {
  if (!rooms[roomID]) return;
    socket.leave(roomID);
    const current_user = rooms[roomID].users.find(
      (user) => user.socketID === socketID
    );

    if (!current_user) return;
    rooms[roomID].users = rooms[roomID].users.filter(
      (user) => user.username !== current_user.username
    );

    if(!rooms[roomID].users.length){
      delete rooms[roomID];
      return;
    }
    else{
      if(current_user.username === rooms[roomID].owner.username){
        rooms[roomID].owner = rooms[roomID].users[0];
        socket.to(roomID).emit("new_owner", rooms[roomID].owner.username);
      }
    }

    // if game was started and left then announce winner
    const user = rooms[roomID].playing_list.find(
      (user) => user.username === current_user.username
    );

    if (user){
      // if someone left while playing, announce winner
      // if anyone have points
    
      if(rooms[roomID].playing_list.length >= 2){
        let winner = rooms[roomID].playing_list.filter((another_user) => another_user.username !== user.username)[0];
        end_game(io, roomID, winner);

      }else{
        rooms[roomID].playing_list = rooms[roomID].playing_list.filter(
          (user) => user.username !== current_user.username
        );
        io.to(roomID).emit("playing_list", rooms[roomID].playing_list);
      }
    }

    io.to(roomID).emit("users", {
        users: rooms[roomID].users.map((user) => user.username),
      });
}