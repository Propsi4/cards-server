import { MessageType } from "../../types/types";
import rooms from "../../store/rooms";

export const new_message = (io, roomID : string, message : MessageType) => {
    if (!rooms[roomID]) return;
      const current_user = rooms[roomID].users.find(
        (user) => user.token === message.sender
      );
      if (!current_user) return;
      clearTimeout(current_user.typing_timeout);
      rooms[roomID].typing = rooms[roomID].typing.filter(
        (user) => user !== current_user.username
      );
      io.to(roomID).emit("typing", rooms[roomID].typing);
      message.sender = current_user.username;
      rooms[roomID].messages.push(message);
      io.to(roomID).emit("update_messages", rooms[roomID].messages);
    }
