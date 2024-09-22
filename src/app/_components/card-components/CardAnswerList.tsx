import { AnswerCard } from '@/app/_components/card-components/AnswerCard'
import { CardResponse } from '@/app/_types/cards'

type Props = {
    cards: CardResponse[] | null
}

export const CardAnswerList = ({ cards }: Props) => {
    return (
        <div className="mt-10">
            {cards && cards.length > 0 ? (
                cards?.map((card) => <AnswerCard key={card.id} card={card} />)
            ) : (
                <h3 className="text-center">回答待ちのカードがありません</h3>
            )}
        </div>
    )
}
