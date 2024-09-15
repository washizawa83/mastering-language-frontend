export type CardResponse = {
    sentence: string
    meaning: string
    imagePath: string
    etymology: string
    id: string
    previousAnswerDate: string
    nextAnswerDate: string
    retentionState: boolean
    savingsScore: number
    updatedAt: string
    createdAt: string
    deckId: string
}

export type CardCreateRequest = {
    sentence: string
    meaning: string
    image_path: string | null
    etymology: string | null
}
