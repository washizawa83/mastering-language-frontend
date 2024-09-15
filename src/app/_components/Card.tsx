import { BaseModal } from '@/app/_components/BaseModal'
import { MenuButton } from '@/app/_components/MenuButton'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import { apiDelete, apiGet, UrlParams } from '@/app/_service/api'
import { CardResponse } from '@/app/_types/cards'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsBoxArrowUpRight, BsThreeDots } from 'react-icons/bs'
import { IoIosArrowDown } from 'react-icons/io'
import { MdDelete, MdEdit } from 'react-icons/md'
import { z } from 'zod'

type Props = {
    card: CardResponse
}
interface DeleteDeckForm {
    delete: string
}

const deleteDeckSchema = z.object({
    delete: z.string().refine((val) => val === '削除', {
        message: '削除と入力してください',
    }),
})

export const Card = ({ card }: Props) => {
    const [cardViewModel, setCardViewModel] = useState<CardResponse | null>(
        card,
    )
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenDetailModal, setIsOpenDetailModal] = useState(false)
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false)
    const [downloadedImage, setDownloadedImage] = useState<string | null>(null)
    const [, setIsLoading] = useState(false)
    const [cookies] = useCookies(['token'])
    const router = useRouter()

    const deleteDeckForm = useForm<DeleteDeckForm>({
        resolver: zodResolver(deleteDeckSchema),
    })

    const onSubmitDeleteDeck: SubmitHandler<DeleteDeckForm> = async () => {
        await deleteCard()
    }

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
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const editMenuItems = [
        {
            label: '編集',
            icon: <MdEdit />,
            handleClick: () =>
                router.push(`/pages/update-card?card=${card.id}`),
        },
        {
            label: '削除',
            icon: <MdDelete />,
            handleClick: () => setIsOpenDeleteModal(true),
        },
    ]

    useEffect(() => {
        const fetchImage = async () => {
            const token = cookies.token
            if (!token) return

            setIsLoading(true)
            try {
                const urlParams: UrlParams = {
                    endpoint: `download-card-image/${card.id}`,
                    token: token,
                }
                const response = await apiGet(urlParams)
                setIsLoading(false)
                if (response) {
                    const src = `data:image/png;base64,${response}`
                    setDownloadedImage(src)
                }
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            }
        }

        if (!isOpenDetailModal) return
        fetchImage()
    }, [isOpenDetailModal])

    if (!cardViewModel) return
    return (
        <div
            key={cardViewModel.id}
            className="p-3 mb-3 border rounded-lg border-abyssal-light dark:border-abyssal-dark cursor-pointer hover:bg-deep-light hover:dark:bg-deep-dark"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex justify-between items-center">
                <h3 className="grow">{cardViewModel.sentence}</h3>
                <ul className="flex mr-3 md:mr-5">
                    <li className="border rounded-full border-abyssal-light dark:border-abyssal-dark h-3 w-3 md:h-4 md:w-4 ml-2 bg-[#ff6347]"></li>
                    <li className="border rounded-full border-abyssal-light dark:border-abyssal-dark h-3 w-3 md:h-4 md:w-4 ml-2 bg-[#4f9a4f]"></li>
                    <li className="border rounded-full border-abyssal-light dark:border-abyssal-dark h-3 w-3 md:h-4 md:w-4 ml-2 bg-[#f4eab4]"></li>
                </ul>
                <div>
                    <IoIosArrowDown />
                </div>
            </div>
            {isOpen && (
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
        </div>
    )
}
