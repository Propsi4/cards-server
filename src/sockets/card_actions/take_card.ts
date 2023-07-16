import rooms from "../../store/rooms";
import { cards } from "../../cards/cards";
import { end_game } from "../end_game";


export const take_card = (io, roomID : string, token : string) => {
     // get one random card from cards
     if(!rooms[roomID]) return;
     const current_user = rooms[roomID].users.find(
       (user) => user.token === token
     );
     if(!current_user) return;
     const user = rooms[roomID].playing_list.find(
       (user) => user.username === current_user.username
     );
     if(!user) return;
     if(user.skipped) return;
     if(rooms[roomID].playing_list.length < 2) return;
     if(!rooms[roomID].unused_cards.length){
       cards.createCards();
       cards.shuffleCards();
       rooms[roomID].unused_cards = cards.getCards();
     };
     let card = rooms[roomID].unused_cards.splice(0,1)[0];

     if(!card) return;
     if(card.value === 11 && user.points + card.value > 21){
        card.value = 1;
      }
     user.points += card.value;
     user.cards.push(card);
     // if somebody skipped
      if(rooms[roomID].playing_list.filter((user) => user.skipped).length){
        if(user.points > rooms[roomID].playing_list.filter((user) => !user.skipped)[0].points ){
          end_game(io, roomID);
          return;
        }
      }

     if(user.points > 21){
       end_game(io, roomID);
       return;
     }
     if(rooms[roomID].playing_list.every((player) => {return player.points === 21})){
      end_game(io, roomID);
      return;
   }
   if(rooms[roomID].playing_list.filter((user) => user.skipped).length > 0 && user.points > rooms[roomID].playing_list.filter((another) => another.username !== user.username)[0].points ){
    end_game(io, roomID);
    return;
  }

   // if everyone not skipped, then change turn
    if(rooms[roomID].playing_list.filter((user) => !user.skipped).length === 2){
      rooms[roomID].turn = (rooms[roomID].turn + 1) % 2;
      io.to(roomID).emit("turn", rooms[roomID].turn);
    }

     io.to(roomID).emit("playing_list", rooms[roomID].playing_list);
    }