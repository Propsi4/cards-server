import rooms from "../../store/rooms";
import { getUsernamefromToken } from "../../utils/utils";

export const user_joined = (io, roomID : string, token : string, socket) => {
    socket.join(roomID);
      const username = getUsernamefromToken(token);
      let cards = [] as any;
      if (!rooms[roomID] || !username) return;
      let current_user = rooms[roomID].users.find(
        (user) => user.token === token
      );
      if (!current_user) {
        rooms[roomID].users.push({
          username: username,
          token: token,
          socketID: socket.id,
        });
      } else {
        current_user.socketID = socket.id;
      }
      const playing_user = rooms[roomID].playing_list.find(
        (user) => user.username === username
      );
      if (playing_user) {
        playing_user.socketID = socket.id;
        cards = playing_user.cards;
      }

      io.to(socket.id).emit("update_messages", rooms[roomID].messages);
      io.to(roomID).emit("users", {
        users: rooms[roomID].users.map((user) => user.username),
      });
      io.to(socket.id).emit("game_info", {
        users: rooms[roomID].users.map((user) => user.username),
        owner: rooms[roomID].owner.username,
        username: username,
        playing_list: rooms[roomID].playing_list,
        cards_on_table: rooms[roomID].cards_on_table,
        turn: rooms[roomID].turn
      });
    }