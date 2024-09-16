import { BaseModal } from '@/app/_components/BaseModal'
import { MenuButton } from '@/app/_components/MenuButton'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import {
    apiDelete,
    apiPut,
    UpdateUrlParams,
    UrlParams,
} from '@/app/_service/api'
import {
    DeckCreateRequest,
    DeckWithCardCountResponse,
} from '@/app/_types/decks'
import { CreateDeckForm, createDeckSchema } from '@/app/pages/decks/page'
import { useLayoutContext } from '@/app/providers/LayoutProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCookies } from 'react-cookie'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdDelete, MdEdit } from 'react-icons/md'
import { z } from 'zod'

type Props = {
    deck: DeckWithCardCountResponse
}

interface DeleteDeckForm {
    delete: string
}

const deleteDeckSchema = z.object({
    delete: z.string().refine((val) => val === '削除', {
        message: '削除と入力してください',
    }),
})

export const Deck = ({ deck }: Props) => {
    const [isOpenEditModal, setIsOpenEditModal] = useState(false)
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
    const [deckViewModel, setDeckViewModel] =
        useState<DeckWithCardCountResponse | null>(deck)

    const { setIsLoading, setSnackbarParam } = useLayoutContext()
    const [cookies] = useCookies(['token'])
    const router = useRouter()

    const editDeckForm = useForm<CreateDeckForm>({
        resolver: zodResolver(createDeckSchema),
    })

    const deleteDeckForm = useForm<DeleteDeckForm>({
        resolver: zodResolver(deleteDeckSchema),
    })

    const onSubmitEditDeck: SubmitHandler<CreateDeckForm> = async (data) => {
        await editDeck(data)
    }

    const onSubmitDeleteDeck: SubmitHandler<DeleteDeckForm> = async () => {
        await deleteDeck()
    }

    const editMenuItems = [
        {
            label: '編集',
            icon: <MdEdit />,
            handleClick: () => setIsOpenEditModal(true),
        },
        {
            label: '削除',
            icon: <MdDelete />,
            handleClick: () => setIsOpenDeleteModal(true),
        },
    ]

    const editDeck = async (data: CreateDeckForm) => {
        const token = cookies.token
        if (!token) return

        setIsLoading(true)
        try {
            const requestBody: DeckCreateRequest = {
                name: data.name,
            }
            const urlParams: UpdateUrlParams = {
                endpoint: `deck/${deck.id}`,
                body: requestBody,
                token: token,
            }
            const response = await apiPut(urlParams)
            if (response) {
                setDeckViewModel(response)
                setSnackbarParam({
                    isVisible: true,
                    message: 'デッキを編集しました',
                    type: 'success',
                })
            }
        } catch (error) {
            setSnackbarParam({
                isVisible: true,
                message: 'デッキの編集に失敗しました',
                type: 'error',
            })
        }
        setIsLoading(false)
    }

    const deleteDeck = async () => {
        const token = cookies.token
        if (!token) return

        setIsLoading(true)
        try {
            const urlParams: UrlParams = {
                endpoint: `deck/${deck.id}`,
                token: token,
            }
            const response = await apiDelete(urlParams)
            setDeckViewModel(response)
            setSnackbarParam({
                isVisible: true,
                message: 'デッキを削除しました',
                type: 'info',
            })
        } catch (error) {
            setSnackbarParam({
                isVisible: true,
                message: 'デッキの削除に失敗しました',
                type: 'error',
            })
        }
        setIsLoading(false)
    }

    if (!deckViewModel) return
    return (
        <>
            <div
                key={deckViewModel.id}
                className="p-3 mb-3 border rounded-lg border-abyssal-light dark:border-abyssal-dark cursor-pointer hover:bg-deep-light hover:dark:bg-deep-dark"
            >
                <button
                    className="w-full"
                    onClick={() =>
                        router.push(`/pages/cards?deck=${deckViewModel.id}`)
                    }
                >
                    <div className="flex h-20">
                        <div className="basis-11/12">
                            <div className="flex justify-between items-center pr-5 ">
                                <h3>{deckViewModel.name}</h3>
                            </div>
                        </div>
                        <div className="flex justify-center items-center relative">
                            <span className="absolute top-0 right-0">
                                <MenuButton
                                    label={
                                        <span className="p-2 rounded-full hover:bg-profound-light dark:hover:bg-profound-dark">
                                            <BsThreeDotsVertical />
                                        </span>
                                    }
                                    items={editMenuItems}
                                />
                            </span>
                            <h3 className="md:text-3xl text-xl font-mono font-light text-flowerBlue pr-2">
                                {deck.cardCount ? deck.cardCount : 0}
                                <span className="text-xs">/cards</span>
                            </h3>
                        </div>
                    </div>
                </button>
            </div>
            <BaseModal isOpen={isOpenEditModal} setIsOpen={setIsOpenEditModal}>
                <form onSubmit={editDeckForm.handleSubmit(onSubmitEditDeck)}>
                    <BaseInput
                        label="デッキ名"
                        id="name"
                        type="text"
                        register={editDeckForm.register('name')}
                        error={editDeckForm.formState.errors.name}
                        initialValue={deck.name}
                    />
                    <div className="text-center">
                        <BaseButton
                            label="変更する"
                            type="submit"
                            handleClick={() => setIsOpenEditModal(false)}
                        />
                    </div>
                </form>
            </BaseModal>
            <BaseModal
                isOpen={isOpenDeleteModal}
                setIsOpen={setIsOpenDeleteModal}
            >
                <form
                    onSubmit={deleteDeckForm.handleSubmit(onSubmitDeleteDeck)}
                >
                    <div className="mb-5">
                        <h3 className="mb-2">
                            デッキを削除する場合、<b>削除</b>
                            と入力してください
                        </h3>
                        <p className="text-sm">
                            デッキを削除すると、デッキに含まれるカードも全て削除されます
                        </p>
                        <BaseInput
                            label=""
                            id="delete"
                            type="text"
                            register={deleteDeckForm.register('delete')}
                            error={deleteDeckForm.formState.errors.delete}
                            placeholder="削除"
                        />
                    </div>
                    <div className="text-center">
                        <BaseButton
                            label="削除する"
                            type="submit"
                            handleClick={() => setIsOpenDeleteModal(false)}
                        />
                    </div>
                </form>
            </BaseModal>
        </>
    )
}
