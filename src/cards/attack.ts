import {CardType} from "../types/types"
import rooms from "../store/rooms";
export const attack = (roomID: string, card: CardType, cardPos: number) => {
    if(!rooms[roomID].cards_on_table.find((a) => a.value === card.value) && 
    !(rooms[roomID].cards_on_table.every((obj) => {return Object.keys(obj).length === 0}))) return;
    if(rooms[roomID].cards_on_table[cardPos]?.value) return
    return true;
}