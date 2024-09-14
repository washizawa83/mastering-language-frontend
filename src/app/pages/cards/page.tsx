'use client'
import { Button } from '@/app/_components/Button'
import { Card } from '@/app/_components/Card'
import { BasePage } from '@/app/_layouts/BasePage'
import { apiGet } from '@/app/_service/api'
import { CardResponse } from '@/app/_types/cards'
import camelcaseKeys from 'camelcase-keys'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { BsPlusLg, BsSearch } from 'react-icons/bs'

export const CardsPage = () => {
    const [cookies] = useCookies(['token'])
    const searchParams = useSearchParams()
    const [cards, setCards] = useState<CardResponse[] | null>(null)

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const token = cookies.token
                if (!token) return
                const deckId = searchParams.get('deck')
                const cards = await apiGet(
                    `http://127.0.0.1:8000/cards/${deckId}`,
                    token,
                )

                setCards(camelcaseKeys(cards))
            } catch (error) {
                console.log(error)
            }
        }

        fetchCards()
    }, [])
    return (
        <BasePage>
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
                        <Button label="カード追加" icon={<BsPlusLg />} />
                    </div>
                </div>
                {cards && cards.length > 0 ? (
                    cards?.map((card) => <Card key={card.id} card={card} />)
                ) : (
                    <h3 className="text-center">カードが追加されていません</h3>
                )}
            </div>
        </BasePage>
    )
}

export default CardsPage
