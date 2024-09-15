'use client'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import { BaseTextArea } from '@/app/_forms/BaseTextArea'
import { BasePage } from '@/app/_layouts/BasePage'
import { apiPost, apiPostForFile } from '@/app/_service/api'
import { CardCreateRequest } from '@/app/_types/cards'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDropzone } from 'react-dropzone'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IconContext } from 'react-icons'
import { RiCloseLargeFill, RiImageAddLine } from 'react-icons/ri'
import { z } from 'zod'

type ImageData = {
    path: string
    name: string
}

interface CardCreateForm {
    sentence: string
    meaning: string
    etymology: string | null
}

const CardCreateSchema = z.object({
    sentence: z
        .string()
        .min(1, 'センテンスを入力してください')
        .max(99, '99文字以内で入力してください'),
    meaning: z
        .string()
        .min(1, '意味を入力してください')
        .max(99, '99文字以内で入力してください'),
    etymology: z.string().max(999, '999文字以内で入力してください'),
})

export const CreateCardPage = () => {
    const [, setIsLoading] = useState(false)
    const [isNextCreate, setIsNextCreate] = useState(false)
    const searchParams = useSearchParams()
    const reader = new FileReader()
    const router = useRouter()
    const [cookies] = useCookies(['token'])
    const [previewImage, setPreviewImage] = useState<ImageData | null>(null)
    const [uploadImageUrlResponse, setUploadImageUrlResponse] = useState<
        string | null
    >(null)

    const cardCreateForm = useForm<CardCreateForm>({
        resolver: zodResolver(CardCreateSchema),
    })

    const cardCreateConfig = [
        {
            label: 'センテンス',
            name: 'sentence',
            type: 'text',
            register: 'sentence',
            errors: cardCreateForm.formState.errors.sentence,
        },
        {
            label: '意味',
            name: 'meaning',
            type: 'text',
            register: 'meaning',
            errors: cardCreateForm.formState.errors.meaning,
        },
        {
            label: '語源',
            name: 'etymology',
            type: 'text',
            register: 'etymology',
            errors: cardCreateForm.formState.errors.etymology,
        },
    ] as const

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        const deckId = searchParams.get('deck')
        const token = cookies.token
        if (!file || !deckId || !token) return

        setIsLoading(true)
        try {
            const requestBody = {
                upload_image: file,
            }
            const response = await apiPostForFile(
                `http://127.0.0.1:8000/upload-card-image/${deckId}`,
                requestBody,
                token,
            )

            setIsLoading(false)
            if (response) {
                reader.readAsDataURL(file)
                reader.onload = () => {
                    setPreviewImage({
                        path: reader.result as string,
                        name: file.name,
                    })
                }
                setUploadImageUrlResponse(response)
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }, [])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg', '.bmp'],
        },
    })

    const createCard = async (data: CardCreateForm) => {
        const deckId = searchParams.get('deck')
        const token = cookies.token
        if (!deckId || !token) return

        setIsLoading(true)
        try {
            const requestBody: CardCreateRequest = {
                sentence: data.sentence,
                meaning: data.meaning,
                image_path: uploadImageUrlResponse,
                etymology: data.etymology,
            }
            const response = await apiPost(
                `http://127.0.0.1:8000/card/${deckId}`,
                requestBody,
                token,
            )

            setIsLoading(false)
            if (response) {
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const onSubmitCreateCard: SubmitHandler<CardCreateForm> = async (data) => {
        await createCard(data)
        if (isNextCreate) {
            cardCreateForm.reset()
            setPreviewImage(null)
            setUploadImageUrlResponse(null)
            return
        }
        router.push(`/pages/cards?deck=${searchParams.get('deck')}`)
    }

    return (
        <BasePage>
            <div className="w-full max-w-128 mx-auto mt-10">
                <div className="flex justify-center items-center">
                    <h2 className="text-2xl">カード作成</h2>
                </div>
                <form
                    onSubmit={cardCreateForm.handleSubmit(onSubmitCreateCard)}
                >
                    {cardCreateConfig.map((config) =>
                        config.name === 'sentence' ? (
                            <BaseInput
                                label={config.label}
                                id={config.name}
                                type={config.type}
                                register={cardCreateForm.register(
                                    config.register,
                                )}
                                error={config.errors}
                                key={config.name}
                            />
                        ) : (
                            <BaseTextArea
                                label={config.label}
                                id={config.name}
                                register={cardCreateForm.register(
                                    config.register,
                                )}
                                error={config.errors}
                                key={config.name}
                            />
                        ),
                    )}
                    <div className="p-2 mb-10">
                        <h1 className="mb-3 text-lg">画像アップロード</h1>
                        {previewImage ? (
                            <div className="flex border border-flowerBlue p-2">
                                <img
                                    className="object-contain md:h-36 md:w-48 h-16 w-28 rounded-lg"
                                    src={previewImage.path}
                                    alt=""
                                />
                                <p className="grow mr-10 p-2">
                                    {previewImage.name}
                                </p>
                                <div className="flex justify-center items-center">
                                    <button
                                        onClick={() => setPreviewImage(null)}
                                        className="bg-deep-light dark:bg-deep-dark p-2 rounded-lg"
                                    >
                                        <IconContext.Provider
                                            value={{ size: '30px' }}
                                        >
                                            <RiCloseLargeFill />
                                        </IconContext.Provider>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center w-full">
                                <div className="flex grow justify-center">
                                    <div
                                        className="w-full border-dashed border border-flowerBlue flex justify-center p-5 mb-2 cursor-pointer"
                                        {...getRootProps()}
                                    >
                                        <input
                                            {...getInputProps()}
                                            accept=".jpg, .jpeg, .png, .bmp"
                                        />
                                        <div className="container flex justify-center text-xs">
                                            <div className="flex flex-col items-center justify-center opacity-70">
                                                <IconContext.Provider
                                                    value={{ size: '30px' }}
                                                >
                                                    <RiImageAddLine />
                                                </IconContext.Provider>
                                                <p className="text-sm mt-5">
                                                    画像を選択またはドラッグ&ドロップ
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-around items-center">
                        <BaseButton
                            label="作成"
                            handleClick={() => setIsNextCreate(false)}
                            type="submit"
                        />
                        <BaseButton
                            label="続けて作成"
                            handleClick={() => setIsNextCreate(true)}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </BasePage>
    )
}

export default CreateCardPage
