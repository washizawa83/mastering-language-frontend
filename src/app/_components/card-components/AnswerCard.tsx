import { BaseModal } from '@/app/_components/BaseModal'
import { Button } from '@/app/_components/Button'
import {
    DeleteCardForm,
    deleteDeckSchema,
} from '@/app/_components/card-components/Card'
import { MenuButton } from '@/app/_components/MenuButton'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import {
    apiDelete,
    apiGet,
    apiPut,
    UpdateUrlParams,
    UrlParams,
} from '@/app/_service/api'
import { CardResponse } from '@/app/_types/cards'
import { useLayoutContext } from '@/app/providers/LayoutProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IconContext } from 'react-icons'
import { BsBoxArrowUpRight, BsCheck, BsThreeDots, BsX } from 'react-icons/bs'
import { MdDelete, MdEdit } from 'react-icons/md'

type Props = {
    card: CardResponse
}

const colors = {
    success: '#22c55e',
    error: '#f43f5e',
}

type AnswerState = {
    isAnswered: boolean
    isCorrect: boolean | null
}

export const AnswerCard = ({ card }: Props) => {
    const [cardViewModel, setCardViewModel] = useState<CardResponse | null>(
        card,
    )
    const [answerState, setAnswerState] = useState<AnswerState>({
        isAnswered: false,
        isCorrect: null,
    })
    const [isOpenDetailModal, setIsOpenDetailModal] = useState(false)
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
    const [downloadedImage, setDownloadedImage] = useState<string | null>(null)

    const { setIsLoading, setSnackbarParam } = useLayoutContext()
    const [cookies] = useCookies(['token'])
    const router = useRouter()

    const deleteCardForm = useForm<DeleteCardForm>({
        resolver: zodResolver(deleteDeckSchema),
    })

    useEffect(() => {
        const fetchImage = async () => {
            const token = cookies.token
            const imagePath = card.imagePath
            if (!token || !imagePath) return

            setIsLoading(true)
            try {
                const urlParams: UrlParams = {
                    endpoint: `download-card-image/${card.id}`,
                    token: token,
                }
                const response = await apiGet(urlParams)
                if (response) {
                    const src = `data:image/png;base64,${response}`
                    setDownloadedImage(src)
                }
            } catch (error) {
                setSnackbarParam({
                    isVisible: true,
                    message: '画像の取得に失敗しました',
                    type: 'error',
                })
            }
            setIsLoading(false)
        }

        if (!isOpenDetailModal) return
        fetchImage()
    }, [isOpenDetailModal])

    const deleteCard = async () => {
        const token = cookies.token
        if (!token) return

        setIsLoading(true)
        try {
            const urlParams: UrlParams = {
                endpoint: `card/${card.id}`,
                token: token,
            }
            const response = await apiDelete(urlParams)
            setCardViewModel(response)
            setSnackbarParam({
                isVisible: true,
                message: 'カードを削除しました',
                type: 'success',
            })
        } catch (error) {
            setSnackbarParam({
                isVisible: true,
                message: 'カードの削除に失敗しました',
                type: 'info',
            })
        }
        setIsLoading(false)
    }

    const onSubmitDeleteDeck: SubmitHandler<DeleteCardForm> = async () => {
        await deleteCard()
    }

    const editMenuItems = [
        {
            label: '編集',
            icon: <MdEdit />,
            handleClick: () => router.push(`/pages/edit-card?card=${card.id}`),
        },
        {
            label: '削除',
            icon: <MdDelete />,
            handleClick: () => setIsOpenDeleteModal(true),
        },
    ]

    const sendAnswer = async (isCorrect: boolean) => {
        const token = cookies.token
        if (!token) return

        setAnswerState({ isAnswered: true, isCorrect })
        const requestBody = {
            is_correct: isCorrect,
        }
        const urlParams: UpdateUrlParams = {
            endpoint: `card-answer/${card.id}`,
            body: requestBody,
            token: token,
        }
        await apiPut(urlParams)
    }

    if (!cardViewModel) return
    return (
        <div
            key={cardViewModel.id}
            className="p-3 mb-3 border rounded-lg border-abyssal-light dark:border-abyssal-dark cursor-pointer hover:bg-deep-light hover:dark:bg-deep-dark"
        >
            <div className="flex justify-between items-center">
                <h3 className="grow">{cardViewModel.sentence}</h3>
                <ul className="flex mr-3 md:mr-5">
                    {answerState.isCorrect !== null &&
                        (answerState.isCorrect === true ? (
                            <div className="flex items-center">
                                <span>回答済み</span>
                                <IconContext.Provider
                                    value={{
                                        color: colors.success,
                                        size: '28px',
                                    }}
                                >
                                    <BsCheck />
                                </IconContext.Provider>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span>回答済み</span>
                                <IconContext.Provider
                                    value={{
                                        color: colors.error,
                                        size: '28px',
                                    }}
                                >
                                    <BsX />
                                </IconContext.Provider>
                            </div>
                        ))}
                    <li className="border rounded-full border-abyssal-light dark:border-abyssal-dark h-3 w-3 md:h-4 md:w-4 ml-2 bg-[#ff6347]"></li>
                    <li className="border rounded-full border-abyssal-light dark:border-abyssal-dark h-3 w-3 md:h-4 md:w-4 ml-2 bg-[#4f9a4f]"></li>
                    <li className="border rounded-full border-abyssal-light dark:border-abyssal-dark h-3 w-3 md:h-4 md:w-4 ml-2 bg-[#f4eab4]"></li>
                </ul>
            </div>
            {answerState.isAnswered ? (
                <div>
                    <div>{cardViewModel.meaning}</div>
                    <div className="mt-3 text-pretty text-sm">
                        {cardViewModel.etymology}
                    </div>
                    <div className="flex item-center mt-3 mx-3">
                        <span
                            onClick={() => setIsOpenDetailModal(true)}
                            className="p-2 rounded-full hover:bg-profound-light dark:hover:bg-profound-dark"
                        >
                            <BsBoxArrowUpRight />
                        </span>
                        <span className="mr-3">
                            <MenuButton
                                label={
                                    <span className="p-2 rounded-full hover:bg-profound-light dark:hover:bg-profound-dark">
                                        <BsThreeDots />
                                    </span>
                                }
                                items={editMenuItems}
                                position="left"
                            />
                        </span>
                    </div>
                </div>
            ) : (
                <div className="flex items-center md:justify-normal justify-between py-3 px-2">
                    <div className="md:mr-10">
                        <Button
                            label="覚えている"
                            icon={<BsCheck />}
                            outline={true}
                            color="success"
                            onClick={() => sendAnswer(true)}
                        />
                    </div>
                    <div className="md:mr-10">
                        <Button
                            label="思い出せない"
                            icon={<BsX />}
                            outline={true}
                            color="error"
                            onClick={() => sendAnswer(false)}
                        />
                    </div>
                </div>
            )}
            <BaseModal
                isOpen={isOpenDetailModal}
                setIsOpen={setIsOpenDetailModal}
            >
                <div>
                    <div className="mb-2">
                        <h3 className="text-xl">{cardViewModel.sentence}</h3>
                    </div>
                    <div className="mb-2">
                        <p className="whitespace-pre-wrap">
                            {cardViewModel.meaning}
                        </p>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        <p className="text-sm whitespace-pre-wrap">
                            {cardViewModel.etymology}
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        {downloadedImage && (
                            <img src={downloadedImage} alt="" />
                        )}
                    </div>
                </div>
            </BaseModal>
            <BaseModal
                isOpen={isOpenDeleteModal}
                setIsOpen={setIsOpenDeleteModal}
            >
                <form
                    onSubmit={deleteCardForm.handleSubmit(onSubmitDeleteDeck)}
                >
                    <div className="mb-5">
                        <h3 className="mb-2">
                            カードを削除する場合、<b>削除</b>
                            と入力してください
                        </h3>
                        <BaseInput
                            label=""
                            id="delete"
                            type="text"
                            register={deleteCardForm.register('delete')}
                            error={deleteCardForm.formState.errors.delete}
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
        </div>
    )
}
