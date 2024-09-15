'use client'
import { Button } from '@/app/_components/Button'
import { Card } from '@/app/_components/Card'
import { BasePage } from '@/app/_layouts/BasePage'
import { apiGet, UrlParams } from '@/app/_service/api'
import { CardResponse } from '@/app/_types/cards'
import { useLayoutContext } from '@/app/providers/LayoutProvider'
import camelcaseKeys from 'camelcase-keys'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { BsPlusLg, BsSearch } from 'react-icons/bs'

export const CardsPage = () => {
    const [cards, setCards] = useState<CardResponse[] | null>(null)

    const { setIsLoading } = useLayoutContext()
    const [cookies] = useCookies(['token'])
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const fetchCards = async () => {
            const token = cookies.token
            const deckId = searchParams.get('deck')
            if (!token || !deckId) return

            setIsLoading(true)
            try {
                const urlParams: UrlParams = {
                    endpoint: `cards/${deckId}`,
                    token: token,
                }
                const cards = await apiGet(urlParams)
                setCards(camelcaseKeys(cards))
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        }

        fetchCards()
    }, [])

    const onGoToCreateCardPage = () => {
        const deckId = searchParams.get('deck')
        router.push(`/pages/create-card?deck=${deckId}`)
    }

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
        </BasePage>
    )
}

export default CardsPage
