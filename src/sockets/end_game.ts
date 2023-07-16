import rooms from "../store/rooms";

export const end_game = (io, roomID : string) => {
    let winner = rooms[roomID].playing_list[0];
    rooms[roomID].playing_list.forEach((user) => {
      if(user.points <= 21) winner = user;
    });
    let loser = rooms[roomID].playing_list.filter((user) => user.username !== winner.username)[0];
    io.to(roomID).emit("results", {winner: winner, loser: loser});
    rooms[roomID].playing_list = [];
    rooms[roomID].turn = 0;
    io.to(roomID).emit("turn", rooms[roomID].turn);
    io.to(roomID).emit("playing_list", rooms[roomID].playing_list);
  }