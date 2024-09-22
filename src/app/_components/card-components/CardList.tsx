import { Button } from '@/app/_components/Button'
import { Card } from '@/app/_components/card-components/Card'
import { CardResponse } from '@/app/_types/cards'
import { useRouter, useSearchParams } from 'next/navigation'
import { BsPlusLg, BsSearch } from 'react-icons/bs'

type Props = {
    cards: CardResponse[] | null
}

export const CardList = ({ cards }: Props) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const onGoToCreateCardPage = () => {
        const deckId = searchParams.get('deck')
        router.push(`/pages/create-card?deck=${deckId}`)
    }

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-10">
                <div className="md:basis-2/6">
                    <div className="relative">
                        <span className="absolute top-2 left-0">
                            <BsSearch />
                        </span>
                        <input
                            type="text"
                            className="bg-transparent border-b-2 focus:outline-none focus:border-focus h-8 p-1 w-full pl-5"
                        />
                    </div>
                </div>
                <div>
                    <Button
                        label="カード追加"
                        icon={<BsPlusLg />}
                        onClick={() => onGoToCreateCardPage()}
                    />
                </div>
            </div>
            {cards && cards.length > 0 ? (
                cards?.map((card) => <Card key={card.id} card={card} />)
            ) : (
                <h3 className="text-center">カードが追加されていません</h3>
            )}
        </div>
    )
}
