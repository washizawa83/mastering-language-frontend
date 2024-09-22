'use client'
import { CardAnswerList } from '@/app/_components/card-components/CardAnswerList'
import { CardList } from '@/app/_components/card-components/CardList'
import { Tab } from '@/app/_components/Tab'
import { BasePage } from '@/app/_layouts/BasePage'
import { UrlParams, apiGet } from '@/app/_service/api'
import { CardResponse } from '@/app/_types/cards'
import { useLayoutContext } from '@/app/providers/LayoutProvider'
import camelcaseKeys from 'camelcase-keys'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

export type TabPageNames = 'list' | 'answer' | 'master'

export const CardsPage = () => {
    const [cards, setCards] = useState<CardResponse[] | null>(null)
    const [answerReplayCards, setAnswerReplayCards] = useState<
        CardResponse[] | null
    >(null)
    const [tabPage, setTabPage] = useState<TabPageNames>('list')

    const [cookies] = useCookies(['token'])
    const searchParams = useSearchParams()
    const { setIsLoading } = useLayoutContext()

    useEffect(() => {
        const token = cookies.token
        const deckId = searchParams.get('deck')
        if (!token || !deckId) return

        const fetchCards = async () => {
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

        const fetchAnswerReplayCards = async () => {
            setIsLoading(true)
            try {
                const urlParams: UrlParams = {
                    endpoint: `answer-replay-cards/${deckId}`,
                    token: token,
                }
                const cards = await apiGet(urlParams)
                setAnswerReplayCards(camelcaseKeys(cards))
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        }

        fetchCards()
        fetchAnswerReplayCards()
    }, [])

    const handleTabAction = (tabName: TabPageNames) => {
        setTabPage(tabName)
    }

    return (
        <BasePage>
            <div className="w-full">
                <ul className="flex items-center justify-between md:justify-normal mt-7">
                    <li className="md:mr-10">
                        <Tab
                            name="カード一覧"
                            tabPageName="list"
                            isSelected={tabPage === 'list'}
                            onTabChange={handleTabAction}
                        />
                    </li>
                    <li className="md:mr-10">
                        <Tab
                            name="回答待ち"
                            tabPageName="answer"
                            isSelected={tabPage === 'answer'}
                            badge={
                                answerReplayCards &&
                                answerReplayCards.length > 0 && (
                                    <span className="text-sm">
                                        {answerReplayCards.length}
                                    </span>
                                )
                            }
                            onTabChange={handleTabAction}
                        />
                    </li>
                    <li className="md:mr-10">
                        <Tab
                            name="習得済み"
                            tabPageName="master"
                            isSelected={tabPage === 'master'}
                            onTabChange={handleTabAction}
                        />
                    </li>
                </ul>
            </div>
            {tabPage === 'list' && <CardList cards={cards} />}
            {tabPage === 'answer' && (
                <CardAnswerList cards={answerReplayCards} />
            )}
        </BasePage>
    )
}

export default CardsPage
