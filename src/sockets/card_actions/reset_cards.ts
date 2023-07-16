import rooms from "../../store/rooms";
import { cards } from "../../cards/cards";

export const reset_cards = (io, roomID : string, token : string) => {
    
    if (!rooms[roomID] || rooms[roomID].owner.token !== token) return;
    if(rooms[roomID].playing_list.length < 2) return;
    cards.createCards();
    cards.shuffleCards();
    rooms[roomID].unused_cards = cards.getCards();
    rooms[roomID].playing_list = [];
    rooms[roomID].turn = 0;
    io.to(roomID).emit("turn", rooms[roomID].turn);
    io.to(roomID).emit("playing_list", rooms[roomID].playing_list);
    
    }