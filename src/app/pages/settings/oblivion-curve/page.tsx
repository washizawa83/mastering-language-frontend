'use client'
import { BaseAuthForm } from '@/app/_forms/BaseAuthForm'
import { BaseButton } from '@/app/_forms/BaseButton'
import { OblivionCurveDateInput } from '@/app/_forms/OblivionCurveDateInput'
import { apiGet, apiPut, UpdateUrlParams, UrlParams } from '@/app/_service/api'
import { useLayoutContext } from '@/app/providers/LayoutProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import camelcaseKeys from 'camelcase-keys'
import Link from 'next/link'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import {
    FieldError,
    FieldErrorsImpl,
    Merge,
    SubmitHandler,
    useForm,
} from 'react-hook-form'
import { IconContext } from 'react-icons'
import { IoIosArrowDropleft } from 'react-icons/io'
import { z } from 'zod'

const levels = [
    'levelOne',
    'levelTwo',
    'levelThree',
    'levelFour',
    'levelFive',
    'levelSix',
    'levelSeven',
] as const

export interface oblivionCurveInput {
    levelOne: {
        month: number
        day: number
        hour: number
    }
    levelTwo: {
        month: number
        day: number
        hour: number
    }
    levelThree: {
        month: number
        day: number
        hour: number
    }
    levelFour: {
        month: number
        day: number
        hour: number
    }
    levelFive: {
        month: number
        day: number
        hour: number
    }
    levelSix: {
        month: number
        day: number
        hour: number
    }
    levelSeven: {
        month: number
        day: number
        hour: number
    }
}

type ParsedDate = {
    month: number
    day: number
    hour: number
}

const units = ['month', 'day', 'hour'] as const

const unitPerSeconds = {
    month: 2592000,
    day: 86400,
    hour: 3600,
} as const

const oblivionCurveLevelSchema = z
    .object({
        month: z.number().gte(0).lte(12),
        day: z.number().gte(0).lte(31),
        hour: z.number().gte(0).lte(24),
    })
    .refine((val) => val.month !== 0 || val.day !== 0 || val.hour !== 0, {
        message: '期間が設定されていません',
        path: [],
    })

const OblivionCurveSchema = z.object({
    levelOne: oblivionCurveLevelSchema,
    levelTwo: oblivionCurveLevelSchema,
    levelThree: oblivionCurveLevelSchema,
    levelFour: oblivionCurveLevelSchema,
    levelFive: oblivionCurveLevelSchema,
    levelSix: oblivionCurveLevelSchema,
    levelSeven: oblivionCurveLevelSchema,
})

export const OblivionCurve = () => {
    const [cookies] = useCookies(['token'])
    const { setSnackbarParam } = useLayoutContext()

    const oblivionCurveForm = useForm<oblivionCurveInput>({
        resolver: zodResolver(OblivionCurveSchema),
    })

    useEffect(() => {
        const getUserSettings = async () => {
            const token = cookies.token
            if (!token) return

            try {
                const urlParams: UrlParams = {
                    endpoint: 'user-settings',
                    token: token,
                }
                const response: UserSettingResponse = await apiGet(urlParams)
                initOblivionCurveForm(camelcaseKeys(response))
            } catch (error) {
                setSnackbarParam({
                    isVisible: true,
                    message: 'ユーザー設定の取得に失敗しました',
                    type: 'error',
                })
            }
        }

        getUserSettings()
    }, [])

    const initOblivionCurveForm = (response: UserSettingResponse) => {
        levels.map((level) => {
            const parsedDate = parseSecondsForDate(response[level])
            oblivionCurveForm.setValue(level, parsedDate)
        })
    }

    const parseSecondsForDate = (seconds: number): ParsedDate => {
        let mathematics = seconds
        const date = units.map((unit) => {
            if (mathematics >= unitPerSeconds[unit]) {
                const divisionResult = Math.round(
                    mathematics / unitPerSeconds[unit],
                )
                mathematics = mathematics % unitPerSeconds[unit]
                return [unit, divisionResult]
            }
            return [unit, 0]
        })
        return Object.fromEntries(date)
    }

    const onSubmitOblivionCurve: SubmitHandler<oblivionCurveInput> = async (
        data,
    ) => {
        const token = cookies.token
        if (!token) return

        try {
            const requestBody = {
                level_one: data.levelOne,
                level_two: data.levelTwo,
                level_three: data.levelThree,
                level_four: data.levelFour,
                level_five: data.levelFive,
                level_six: data.levelSix,
                level_seven: data.levelSeven,
            }
            const urlParams: UpdateUrlParams = {
                endpoint: 'user-settings',
                body: requestBody,
                token: token,
            }
            await apiPut(urlParams)
            setSnackbarParam({
                isVisible: true,
                message: 'ユーザー設定を更新しました',
                type: 'success',
            })
        } catch (error) {
            setSnackbarParam({
                isVisible: true,
                message: 'ユーザー設定の更新に失敗しました',
                type: 'error',
            })
        }
    }

    const displayErrorMessage = (
        errors:
            | Merge<
                  FieldError,
                  FieldErrorsImpl<{ month: number; day: number; hour: number }>
              >
            | undefined,
    ): string | undefined => {
        if (!errors) return ''
        if (errors.root) return errors.root.message

        const displayErrors = units.map((unit) => {
            if (errors?.[unit]?.message) {
                return errors[unit].message
            }
        })
        return displayErrors[0]
    }

    return (
        <BaseAuthForm title="忘却曲線設定">
            <div className="px-5">
                <div className="inline-block mb-5">
                    <Link href="/pages/settings/" className="flex items-center">
                        <IconContext.Provider value={{ size: '20px' }}>
                            <IoIosArrowDropleft />
                        </IconContext.Provider>
                        <p className="text-sm ml-2">設定へ戻る</p>
                    </Link>
                </div>
                <form
                    onSubmit={oblivionCurveForm.handleSubmit(
                        onSubmitOblivionCurve,
                    )}
                >
                    <ul>
                        {levels.map((level, i) => (
                            <li
                                className="flex items-center justify-between h-14 mb-3 py-2"
                                key={level}
                            >
                                <h3 className="basis-4/12">{`レベル${i + 1}`}</h3>
                                <div>
                                    <div className="flex items-center grow justify-between">
                                        <OblivionCurveDateInput
                                            level={level}
                                            form={oblivionCurveForm}
                                        />
                                    </div>
                                    <span className="text-error text-xs h-4">
                                        {displayErrorMessage(
                                            oblivionCurveForm.formState
                                                .errors?.[level],
                                        )}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-center my-10">
                        <BaseButton label="設定" handleClick={() => {}} />
                    </div>
                </form>
            </div>
        </BaseAuthForm>
    )
}

export default OblivionCurve
