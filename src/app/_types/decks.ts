export type DeckResponse = {
    id: string
    name: string
    updatedAt: string
    createdAt: string
}

export type DeckWithCardCountResponse = {
    cardCount: number
    answerReplayCount: number
} & DeckResponse

export type DeckCreateRequest = {
    name: string
}
