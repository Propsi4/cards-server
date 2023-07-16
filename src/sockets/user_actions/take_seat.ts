import rooms from "../../store/rooms";

export const take_seat = (io, roomID : string, token : string, index : number) => {
    if (!rooms[roomID]) return;
    const current_user = rooms[roomID].users.find(
      (user) => user.token === token
    );
    if (!current_user) return;
    const user = rooms[roomID].playing_list.find(
      (user) => user.username === current_user.username
    );

    const seat = rooms[roomID].playing_list.find(
      (user) => user.seat === index
    );
    if (seat) return;
    if (!user) {
      rooms[roomID].playing_list.push({
        username: current_user.username,
        cards: [],
        skipped: false,
        points: 0,
        seat: index,
        socketID: current_user.socketID,
      });
    } else {
      user.seat = index;
    }
    io.to(roomID).emit(
      "playing_list",
      rooms[roomID].playing_list
    );
}