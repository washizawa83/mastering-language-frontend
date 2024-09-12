'use client'
import { BasePage } from '@/app/_layouts/BasePage'
import { apiGet } from '@/app/_service/api'
import { DeckResponse } from '@/app/_types/decks'
import camelcaseKeys from 'camelcase-keys'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

export const DeckPage = () => {
    const [decks, setDecks] = useState<DeckResponse[] | null>(null)
    const [cookies] = useCookies(['token'])

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const token = cookies.token
                if (!token) return
                const fetchedDecks: DeckResponse[] = await apiGet(
                    'http://127.0.0.1:8000/decks',
                    token,
                )

                setDecks(camelcaseKeys(fetchedDecks))
            } catch (error) {
                console.log(error)
            }
        }

        fetchDecks()
    }, [])

    return (
        <BasePage>
            <div className="mt-10">
                {decks?.map((deck) => (
                    <div
                        key={deck.id}
                        className="p-3 mb-3 border rounded-lg border-abyssal-light dark:border-abyssal-dark cursor-pointer hover:bg-deep-light hover:dark:bg-deep-dark"
                    >
                        <Link href={`/pages/cards?deck=${deck.id}`}>
                            <div className="h-32">
                                <h3 className="ml-5 mt-3">{deck.name}</h3>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </BasePage>
    )
}

export default DeckPage
