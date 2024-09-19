'use client'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import { BaseTextArea } from '@/app/_forms/BaseTextArea'
import { UploadImageForm } from '@/app/_forms/UploadImageForm'
import { UploadImagePreviewForm } from '@/app/_forms/UploadImagePreviewForm'
import { BasePage } from '@/app/_layouts/BasePage'
import {
    apiGet,
    apiPostForFile,
    apiPut,
    UpdateUrlParams,
    UrlParams,
} from '@/app/_service/api'
import { CardCreateRequest, CardResponse } from '@/app/_types/cards'
import { ImageData } from '@/app/pages/create-card/page'
import { useLayoutContext } from '@/app/providers/LayoutProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import camelcaseKeys from 'camelcase-keys'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDropzone } from 'react-dropzone'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

interface CardEditForm {
    sentence: string
    meaning: string
    etymology: string | null
}

const CardEditSchema = z.object({
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

export const EditCardPage = () => {
    const [currentCard, setCurrentCard] = useState<CardResponse | null>(null)
    const [previewImage, setPreviewImage] = useState<ImageData | null>(null)
    const [uploadImageUrlResponse, setUploadImageUrlResponse] = useState<
        string | null
    >(null)

    const { setIsLoading, setSnackbarParam } = useLayoutContext()
    const [cookies] = useCookies(['token'])
    const searchParams = useSearchParams()
    const router = useRouter()
    const reader = new FileReader()

    const cardEditForm = useForm<CardEditForm>({
        resolver: zodResolver(CardEditSchema),
    })

    const cardEditConfig = [
        {
            label: 'センテンス',
            name: 'sentence',
            type: 'text',
            register: 'sentence',
            errors: cardEditForm.formState.errors.sentence,
        },
        {
            label: '意味',
            name: 'meaning',
            type: 'text',
            register: 'meaning',
            errors: cardEditForm.formState.errors.meaning,
        },
        {
            label: '語源',
            name: 'etymology',
            type: 'text',
            register: 'etymology',
            errors: cardEditForm.formState.errors.etymology,
        },
    ] as const

    useEffect(() => {
        const token = cookies.token
        const cardId = searchParams.get('card')
        if (!token || !cardId) return

        setIsLoading(true)
        const fetchCard = async () => {
            try {
                const urlParams: UrlParams = {
                    endpoint: `card/${cardId}`,
                    token: token,
                }
                const response = await apiGet(urlParams)
                if (response) {
                    const convertedResponse: CardResponse =
                        camelcaseKeys(response)
                    setCurrentCard(convertedResponse)
                    setUploadImageUrlResponse(convertedResponse.imagePath)

                    cardEditForm.setValue(
                        'sentence',
                        convertedResponse.sentence,
                    )
                    cardEditForm.setValue('meaning', convertedResponse.meaning)
                    cardEditForm.setValue(
                        'etymology',
                        convertedResponse.etymology,
                    )
                }
            } catch (error) {
                setSnackbarParam({
                    isVisible: true,
                    message: 'カードの取得に失敗しました',
                    type: 'error',
                })
            }
            setIsLoading(false)
        }

        const fetchImage = async () => {
            try {
                const urlParams: UrlParams = {
                    endpoint: `download-card-image/${cardId}`,
                    token: token,
                }
                const response = await apiGet(urlParams)
                if (response && response?.status_code !== 500) {
                    const src = `data:image/png;base64,${response}`
                    setPreviewImage({ path: src, name: 'uploaded image' })
                }
            } catch (error) {
                setSnackbarParam({
                    isVisible: true,
                    message: '画像の取得に失敗しました',
                    type: 'error',
                })
            }
        }

        fetchCard()
        fetchImage()
    }, [])

    const handleDeletePreviewImage = () => {
        setPreviewImage(null)
        setUploadImageUrlResponse(null)
    }

    const onSubmitEditCard: SubmitHandler<CardEditForm> = async (data) => {
        await updateCard(data)
        router.push(`/pages/cards?deck=${currentCard?.deckId}`)
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            const token = cookies.token
            if (!file || !currentCard || !token) return

            setIsLoading(true)
            try {
                const requestBody = {
                    upload_image: file,
                }
                const urlParams: UpdateUrlParams = {
                    endpoint: `upload-card-image/${currentCard.deckId}`,
                    body: requestBody,
                    token: token,
                }
                const response = await apiPostForFile(urlParams)

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
                setSnackbarParam({
                    isVisible: true,
                    message: '画像のアップロードに失敗しました',
                    type: 'error',
                })
            }
            setIsLoading(false)
        },
        [currentCard],
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png', '.jpg', '.jpeg', '.bmp'],
        },
    })

    const updateCard = async (data: CardEditForm) => {
        const token = cookies.token
        if (!currentCard || !token) return

        try {
            const requestBody: CardCreateRequest = {
                sentence: data.sentence,
                meaning: data.meaning,
                image_path: uploadImageUrlResponse,
                etymology: data.etymology,
            }
            const urlParams: UpdateUrlParams = {
                endpoint: `card/${currentCard.id}`,
                body: requestBody,
                token: token,
            }
            await apiPut(urlParams)
            setSnackbarParam({
                isVisible: true,
                message: 'カードを編集しました',
                type: 'success',
            })
        } catch (error) {
            setSnackbarParam({
                isVisible: true,
                message: 'カードの編集に失敗しました',
                type: 'error',
            })
        }
    }

    return (
        <BasePage>
            <div className="w-full max-w-128 mx-auto mt-10">
                <div className="flex justify-center items-center">
                    <h2 className="text-2xl">カード編集</h2>
                </div>
                <form onSubmit={cardEditForm.handleSubmit(onSubmitEditCard)}>
                    {cardEditConfig.map((config) =>
                        config.name === 'sentence' ? (
                            <BaseInput
                                label={config.label}
                                id={config.name}
                                type={config.type}
                                register={cardEditForm.register(
                                    config.register,
                                )}
                                error={config.errors}
                                key={config.name}
                            />
                        ) : (
                            <BaseTextArea
                                label={config.label}
                                id={config.name}
                                register={cardEditForm.register(
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
                            <UploadImagePreviewForm
                                previewImage={previewImage}
                                onClickDelete={handleDeletePreviewImage}
                            />
                        ) : (
                            <UploadImageForm
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                            />
                        )}
                    </div>
                    <div className="flex justify-around items-center">
                        <BaseButton
                            label="更新"
                            handleClick={() => {}}
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </BasePage>
    )
}

export default EditCardPage
