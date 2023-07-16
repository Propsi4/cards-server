import {CardType} from "../types/types"
import rooms from "../store/rooms";
export const defend = (roomID: string, card_defender: CardType, cardPos: number) => {
    let card_attacker = rooms[roomID].cards_on_table[cardPos]
    let trump_suit = rooms[roomID].trump_suit
    if(Object.keys(card_attacker).length === 0) return
    if(card_attacker.suit === trump_suit){
        if(card_defender.suit !== trump_suit) return
        if(card_defender.value < card_attacker.value) return
    }
    if(card_attacker.suit === card_defender.suit){
        if(card_attacker.value > card_defender.value) return
    }
    return true;
}