import rooms from "../../store/rooms";

export const typing = (io, roomID : string, token : string) => {
    if (!rooms[roomID]) return;
    const current_user = rooms[roomID].users.find(
      (user) => user.token === token
    );
    if (!current_user) return;
    clearTimeout(current_user.typing_timeout);

    if (!rooms[roomID].typing.includes(current_user.username)) {
      rooms[roomID].typing.push(current_user.username);
    }
    current_user.typing_timeout = setTimeout(() => {
      rooms[roomID].typing = rooms[roomID].typing.filter(
        (user) => user !== current_user.username
      );
      io.to(roomID).emit("typing", rooms[roomID].typing);
    }, 4000);
    io.to(roomID).emit("typing", rooms[roomID].typing);
}