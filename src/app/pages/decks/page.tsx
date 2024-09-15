'use client'
import { BaseModal } from '@/app/_components/BaseModal'
import { Button } from '@/app/_components/Button'
import { Deck } from '@/app/_components/Deck'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import { BasePage } from '@/app/_layouts/BasePage'
import { apiGet, apiPost, UpdateUrlParams, UrlParams } from '@/app/_service/api'
import {
    DeckCreateRequest,
    DeckWithCardCountResponse,
} from '@/app/_types/decks'
import { useLayoutContext } from '@/app/providers/LayoutProvider'
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
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [decks, setDecks] = useState<DeckWithCardCountResponse[] | null>(null)

    const [cookies] = useCookies(['token'])
    const { setIsLoading } = useLayoutContext()

    const createDeckForm = useForm<CreateDeckForm>({
        resolver: zodResolver(createDeckSchema),
    })

    const onSubmitCreateDeck: SubmitHandler<CreateDeckForm> = async (data) => {
        await createDeck(data)
    }

    useEffect(() => {
        const fetchDecks = async () => {
            const token = cookies.token
            if (!token) return

            setIsLoading(true)
            try {
                const urlParams: UrlParams = {
                    endpoint: 'decks-with-card-count',
                    token: token,
                }
                const fetchedDecks: DeckWithCardCountResponse[] =
                    await apiGet(urlParams)

                setDecks(camelcaseKeys(fetchedDecks))
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        }

        fetchDecks()
    }, [])

    const createDeck = async (data: CreateDeckForm) => {
        const token = cookies.token
        if (!token) return

        setIsLoading(true)
        try {
            const requestBody: DeckCreateRequest = {
                name: data.name,
            }
            const urlParams: UpdateUrlParams = {
                endpoint: 'deck',
                body: requestBody,
                token: token,
            }
            const response = await apiPost(urlParams)
            if (response) {
                decks ? setDecks([...decks, response]) : setDecks([response])
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
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
