import rooms from "../../store/rooms";

export const alive = (io, roomID : string, token : string) => {
    if (!rooms[roomID]) return;
      const current_user = rooms[roomID].users.find(
        (user) => user.token === token
      );
      if (!current_user) return;
      clearTimeout(current_user.alive_timeout);
      current_user.alive_timeout = setTimeout(() => {
        if(rooms[roomID].owner.token === current_user.token){
          let user = rooms[roomID].users[Math.floor((Math.random()*rooms[roomID].users.length))];
          while(user.token !== current_user.token){
            if(rooms[roomID].users.length === 1) break;
            user = rooms[roomID].users[Math.floor((Math.random()*rooms[roomID].users.length))];
          }
          rooms[roomID].owner = {username: user.username, token: user.token};
          io.to(roomID).emit("new_owner", rooms[roomID].owner.username);
        }
        rooms[roomID].users = rooms[roomID].users.filter(
          (user) => user.token !== token
        );
        rooms[roomID].playing_list = rooms[roomID].playing_list.filter(
          (user) => user.username !== current_user.username
        );
        io.to(roomID).emit("playing_list", rooms[roomID].playing_list);
        io.to(roomID).emit("users", {
          users: rooms[roomID].users.map((user) => user.username),
        });
      }, 10000);
    }