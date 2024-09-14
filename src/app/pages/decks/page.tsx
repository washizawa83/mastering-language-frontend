'use client'
import { BaseModal } from '@/app/_components/BaseModal'
import { Button } from '@/app/_components/Button'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import { BasePage } from '@/app/_layouts/BasePage'
import { apiGet, apiPost } from '@/app/_service/api'
import {
    DeckCreateRequest,
    DeckWithCardCountResponse,
} from '@/app/_types/decks'
import { zodResolver } from '@hookform/resolvers/zod'
import camelcaseKeys from 'camelcase-keys'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsPlusLg, BsThreeDotsVertical } from 'react-icons/bs'
import { z } from 'zod'

interface CreateDeckForm {
    name: string
}

const createDeckSchema = z.object({
    name: z
        .string()
        .min(1, '名前を入力してください')
        .max(30, '名前は30文字以内で入力してください'),
})

export const DeckPage = () => {
    const [decks, setDecks] = useState<DeckWithCardCountResponse[] | null>(null)
    const [cookies] = useCookies(['token'])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [, setIsLoading] = useState(false)

    const createDeckForm = useForm<CreateDeckForm>({
        resolver: zodResolver(createDeckSchema),
    })

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const token = cookies.token
                if (!token) return
                const fetchedDecks: DeckWithCardCountResponse[] = await apiGet(
                    'http://127.0.0.1:8000/decks-with-card-count',
                    token,
                )

                setDecks(camelcaseKeys(fetchedDecks))
            } catch (error) {
                console.log(error)
            }
        }

        fetchDecks()
    }, [])

    const createDeck = async (data: CreateDeckForm) => {
        setIsLoading(true)
        try {
            const token = cookies.token
            if (!token) return
            const requestBody: DeckCreateRequest = {
                name: data.name,
            }
            const response = await apiPost(
                'http://127.0.0.1:8000/deck',
                requestBody,
                token,
            )
            if (response) {
                decks
                    ? setDecks([...decks, response.data])
                    : setDecks([response.data])
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const onSubmitCreateDeck: SubmitHandler<CreateDeckForm> = async (data) => {
        await createDeck(data)
    }

    return (
        <BasePage>
            <div className="mt-10 relative">
                <div className="flex items-center justify-between mb-10">
                    <div className="md:basis-2/6"></div>
                    <div>
                        <Button
                            label="デッキ追加"
                            icon={<BsPlusLg />}
                            onClick={() => setIsOpenModal(true)}
                        />
                    </div>
                </div>
                {decks && decks.length > 0 ? (
                    decks?.map((deck) => (
                        <div
                            key={deck.id}
                            className="p-3 mb-3 border rounded-lg border-abyssal-light dark:border-abyssal-dark cursor-pointer hover:bg-deep-light hover:dark:bg-deep-dark"
                        >
                            <Link href={`/pages/cards?deck=${deck.id}`}>
                                <div className="flex h-20">
                                    <div className="basis-11/12">
                                        <div className="flex justify-between items-center pr-5 ">
                                            <h3>{deck.name}</h3>
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center relative">
                                        <span className="absolute top-0 right-0">
                                            <BsThreeDotsVertical />
                                        </span>
                                        <h3 className="md:text-3xl text-xl font-mono font-light text-flowerBlue pr-2">
                                            {deck.cardCount}
                                            <span className="text-xs">
                                                /cards
                                            </span>
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <h3 className="text-center">デッキが追加されていません</h3>
                )}
                <BaseModal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
                    <form
                        onSubmit={createDeckForm.handleSubmit(
                            onSubmitCreateDeck,
                        )}
                    >
                        <BaseInput
                            label="デッキ名"
                            id="name"
                            type="text"
                            register={createDeckForm.register('name')}
                            error={createDeckForm.formState.errors.name}
                        />
                        <div className="text-center">
                            <BaseButton
                                label="作成"
                                type="submit"
                                handleClick={() => {}}
                            />
                        </div>
                    </form>
                </BaseModal>
            </div>
        </BasePage>
    )
}

export default DeckPage
