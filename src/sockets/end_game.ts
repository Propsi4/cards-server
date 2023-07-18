import rooms from "../store/rooms";
import { UsersPlayingType } from "../types/types";

export const end_game = (io, roomID : string, winner = {} as UsersPlayingType) => {
  if(!rooms[roomID] || !winner) return;
  if(!rooms[roomID].playing_list.length) return;
  if(!Object.keys(winner).length){
    winner = rooms[roomID].playing_list[0];
    // winner is the guy with biggest points
    rooms[roomID].playing_list.forEach((user) => {
      if(user.points > winner.points && user.points <= 21){
        winner = user;
      }
    }
    )
  }

    let loser = rooms[roomID].playing_list.filter((user) => user.username !== winner.username)[0];
    io.to(roomID).emit("results", {winner: winner, loser: loser});
    // clears cards and points
    if(rooms[roomID].clear_on_end){
      rooms[roomID].playing_list = []
    }else{
      rooms[roomID].playing_list.forEach((user) => {
        user.points = 0
        user.cards = []
        user.skipped = false
      })
    }

    rooms[roomID].turn = 0;
    io.to(roomID).emit("turn", rooms[roomID].turn);
    io.to(roomID).emit("playing_list", rooms[roomID].playing_list);
  }
