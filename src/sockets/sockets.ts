import socketIO from "socket.io";
import { MessageType } from "../types/types";

import { new_message } from "./messages/new_message";
import { user_joined } from "./user_actions/user_joined";
import { typing } from "./messages/typing";
import { alive } from "./user_actions/alive";
import { reset_cards } from "./card_actions/reset_cards";
import { pass } from "./card_actions/pass";
import { take_card } from "./card_actions/take_card";
import { leave_seat } from "./user_actions/leave_seat";
import { take_seat } from "./user_actions/take_seat";
import { left_room } from "./user_actions/left_room";
import { clear_on_end } from "./user_actions/clear_on_end";
const socketConnetion = (server: any) => {
  const io = new socketIO.Server(server);

  io.sockets.on("connection", (socket) => {
    socket.on("take_seat", (roomID: string, token: string, index: number) => {
      take_seat(io, roomID, token, index);
    });

    socket.on("leave_seat", (roomID: string, token: string) => {
      leave_seat(io, roomID, token);
    });

    socket.on("take_card",(roomID: string, token: string) => {
      take_card(io, roomID, token);
    });
    
    socket.on("pass",(roomID: string, token: string) => {
      pass(io, roomID, token);
    });
    socket.on("reset_cards", (roomID: string, token: string) => {
      reset_cards(io, roomID, token);
    });

    socket.on("alive", (roomID: string, token: string) => {
      alive(io,socket, roomID, token);
    });

    socket.on("typing", (roomID: string, token: string) => {
      typing(io, roomID, token);
    });

    socket.on("user_joined", (roomID: string, token: string) => {
      user_joined(io, roomID, token, socket);
    });

    socket.on("new_message", (roomID: string, message: MessageType) => {
      new_message(io, roomID, message);
    });

    socket.on("left_room", (roomID: string, socketID: string) => {
      left_room(io, socket, roomID, socketID);
  });
    socket.on("clear_on_end", (roomID: string, token: string, setting: boolean) => {
      clear_on_end(roomID, token, setting);
    });
  });
};
// Баг з показом карт

export default socketConnetion;
