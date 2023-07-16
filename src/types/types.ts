export interface UsersType{
    username: string,
    socketID: string,
    token: string,
    typing_timeout?: any,
    alive_timeout?: any
}
export interface UsersPlayingType{
    username: string,
    socketID: string,
    points: number,
    skipped: boolean,
    cards: CardType[],
    seat: number,
}
export interface MessageType{
        text: string,
        sentTime: string,
        sender: string
}

export interface CardType{
    name : string,
    value : number,
    suit : string
}

export interface RoomsType {
    [roomID: string]: {
        messages: MessageType[]
        users: UsersType[],
        turn: number ,
        owner: {token: string, username: string},
        playing_list: UsersPlayingType[],
        cards_on_table: CardType[],
        unused_cards: CardType[]
        typing: string[]
    }
}