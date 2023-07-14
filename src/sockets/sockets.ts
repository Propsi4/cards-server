import socketIO from "socket.io";
import { CardType, MessageType } from "../types/types";
import rooms from "../store/rooms";
import { getUsernamefromToken, isEquivalent, getNeighbours } from "./../utils/utils";
import { cards } from "./../cards/cards";
import {attack} from "../cards/attack";
import {defend} from "../cards/defend";

const socketConnetion = (server: any) => {
  const io = new socketIO.Server(server);

  io.sockets.on("connection", (socket) => {
    socket.on("take_seat", (roomID: string, token: string, index: number) => {
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
          seat: index,
          socketID: current_user.socketID,
        });
      } else {
        user.seat = index;
      }
      io.to(roomID).emit(
        "playing_list",
        rooms[roomID].playing_list.map((user) => {
          return { username: user.username, seat: user.seat };
        })
      );
    });

    socket.on("leave_seat", (roomID: string, token: string) => {
      if (!rooms[roomID]) return;
      const current_user = rooms[roomID].users.find(
        (user) => user.token === token
      );
      if (!current_user) return;
      rooms[roomID].playing_list = rooms[roomID].playing_list.filter(
        (user) => user.username !== current_user.username
      );
      io.to(roomID).emit("playing_list", rooms[roomID].playing_list);
    });

    socket.on(
      "play_card",
      (roomID: string, token: string, card: CardType, cardPos: number) => {
        if (!rooms[roomID]) return;
        const current_user = rooms[roomID].users.find(
          (user) => user.token === token
        );
        if (!current_user) return;
        const user = rooms[roomID].playing_list.find(
          (user) => user.username === current_user.username
        );
        if (!user) return;
        if (!card || cardPos === null) return;
        // if(Object.keys(rooms[roomID].neighbours).length === 0) rooms[roomID].neighbours = getNeighbours(rooms[roomID].playing_list, rooms[roomID].playing_list[1].seat);
        if([rooms[roomID].neighbours.left,rooms[roomID].neighbours.right].includes(user.seat)){
          console.log("attack")
          if(!attack(roomID,card,cardPos)) return
        }
        else if(rooms[roomID].neighbours.defender == user.seat){
          console.log("defend")
          if(!defend(roomID,card,cardPos)) return
        }
        console.log(rooms[roomID].neighbours.left, rooms[roomID].neighbours.right)
        // checks if all the obj in the array are null
        // const isAllNull = rooms[roomID].cards_on_table.every((obj) => {
        //   return Object.keys(obj).length === 0;
        // });
        // if(isAllNull && user.seat !== rooms[roomID].neighbours.left) return;
        // if (rooms[roomID].cards_on_table[cardPos]?.value) {
        //   if (
        //     card?.suit !== rooms[roomID].trump_suit &&
        //     rooms[roomID].cards_on_table[cardPos].suit ===
        //       rooms[roomID].trump_suit
        //   )
        //     return;
        //   if (
        //     card?.suit === rooms[roomID].trump_suit &&
        //     rooms[roomID].cards_on_table[cardPos].suit ===
        //       rooms[roomID].trump_suit &&
        //     card?.value <= rooms[roomID].cards_on_table[cardPos].value
        //   )
        //     return;
        //   if (
        //     card?.suit !== rooms[roomID].trump_suit &&
        //     rooms[roomID].cards_on_table[cardPos].suit !==
        //       rooms[roomID].trump_suit &&
        //     card?.value <= rooms[roomID].cards_on_table[cardPos].value
        //   )
        //     return;
        //   if (
        //     card?.suit !== rooms[roomID].trump_suit &&
        //     card?.suit !== rooms[roomID].cards_on_table[cardPos].suit
        //   )
        //     return;
        // }

        // checks if object is equivalent
        user.cards = user.cards.filter(
          (user_card) => !isEquivalent(user_card, card)
        );
        // rooms[roomID].neighbours = getNeighbours(rooms[roomID].playing_list.length, rooms[roomID].neighbours.defender);

        // io.to(roomID).emit("neighbours", rooms[roomID].neighbours);
        io.to(user.socketID).emit("get_cards", {
          cards: user.cards,
          trump_suit: rooms[roomID].trump_suit,
        });
        rooms[roomID].cards_on_table[cardPos] = card;
        io.to(roomID).emit("cards_on_table", rooms[roomID].cards_on_table);
      }
    );

    socket.on("reset_cards", (roomID: string, token: string) => {

      if (!rooms[roomID] || rooms[roomID].owner.token !== token) return;
      if(rooms[roomID].playing_list.length < 2) return;
      rooms[roomID].playing_list.sort((a,b) => a.seat - b.seat)
      rooms[roomID].neighbours = getNeighbours(rooms[roomID].playing_list,rooms[roomID].playing_list[1].seat);
      io.to(roomID).emit("neighbours", rooms[roomID].neighbours);
      cards.createCards();
      cards.shuffleCards();
      rooms[roomID].unused_cards = cards.getCards();
      rooms[roomID].trump_suit = cards.getTrumpSuit();

      rooms[roomID].cards_on_table = Array(5).fill({});
      io.to(roomID).emit("cards_on_table", rooms[roomID].cards_on_table);
      rooms[roomID].playing_list.forEach((user) => {
        user.cards = rooms[roomID].unused_cards.splice(0, 6);
        io.to(user.socketID).emit("get_cards", {
          cards: user.cards,
          trump_suit: rooms[roomID].trump_suit,
        });
      });
    });

    socket.on("alive", (roomID: string, token: string) => {
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
        io.to(roomID).emit("playing_list", rooms[roomID].playing_list.map((user) => {return {username: user.username, seat: user.seat}}));
        io.to(roomID).emit("users", {
          users: rooms[roomID].users.map((user) => user.username),
        });
      }, 10000);
    });

    socket.on("typing", (roomID: string, token: string) => {
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
    });

    socket.on("user_joined", (roomID: string, token: string) => {
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
        cards: cards,
        playing_list: rooms[roomID].playing_list.map((user) => {
          return { username: user.username, seat: user.seat };
        }),
        trump_suit: rooms[roomID].trump_suit,
        cards_on_table: rooms[roomID].cards_on_table,
        neighbours: rooms[roomID].neighbours
      });
    });

    socket.on("new_message", (roomID: string, message: MessageType) => {
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
    });
  });
};

export default socketConnetion;
