import { CardType } from "../types/types";
class Cards {
  cards: CardType[];
  suits: string[];
  names: string[];
  constructor() {
    this.cards = [];
    this.suits = ["spades", "hearts", "diamonds", "clubs"];
    //this.markupCards = [];
    this.names = ["6","7","8","9","10","J","Q","K","A"];
  }
  getTrumpSuit() {
    return this.suits[Math.floor(Math.random() * 4)];
  }
  getCards(){
    return this.cards;
  }

  getCard(cardName) {
    return this.cards.find((card) => card.name === cardName);
  }

//   getMarkupCard(cardName) {
//     return this.markupCards.find((card) => card.name === cardName);
//   }

//   createMarkupCards() {
//     let markupCards = [];
//     for (let i = 0; i < 4; i++) {
//       for (let j = 0; j < 9; j++) {
//         let markupCard = new MarkupCard();
//         markupCard.name = this.names[j];
//         markupCard.value = j+1;
//         markupCard.suit = this.suits[i];
//         markupCards.push(markupCard);
//       }
//     }
//     this.markupCards = markupCards;
//   }

  createCards() {
    let cards : CardType[] = [];
    for (let j = 0; j < 9; j++) {
        for (let i = 0; i < 4; i++) {
        let card = {
          name: this.names[j],
          value: j+6,
          suit: this.suits[i],
        };
        cards.push(card);
      }
    }
    this.cards = cards;
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

//   shuffleMarkupCards() {
//     for (let i = this.markupCards.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [this.markupCards[i], this.markupCards[j]] = [
//         this.markupCards[j],
//         this.markupCards[i],
//       ];
//     }
//   }
}

export const cards = new Cards();