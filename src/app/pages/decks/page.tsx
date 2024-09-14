'use client'
import { BaseModal } from '@/app/_components/BaseModal'
import { Button } from '@/app/_components/Button'
import { Deck } from '@/app/_components/Deck'
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
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsPlusLg } from 'react-icons/bs'
import { z } from 'zod'

export interface CreateDeckForm {
    name: string
}

export const createDeckSchema = z.object({
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
                    decks?.map((deck) => <Deck deck={deck} key={deck.id} />)
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
                                handleClick={() => setIsOpenModal(false)}
                            />
                        </div>
                    </form>
                </BaseModal>
            </div>
        </BasePage>
    )
}

export default DeckPage
