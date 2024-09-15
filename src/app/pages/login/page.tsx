'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

import { BaseAuthForm } from '@/app/_forms/BaseAuthForm'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import { LoadingButton } from '@/app/_forms/LoadingButton'
import { PasswordInput } from '@/app/_forms/PasswordInput'
import { apiPost, UpdateUrlParams } from '@/app/_service/api'
import {
    LoginAndVerifyRequest,
    LoginRequest,
    LoginResponse,
} from '@/app/_types/auth'
import { useAuthContext } from '@/app/providers/AuthProvider'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface LoginFormInput {
    email: string
    password: string
}

interface LoginAndVerifyUserCodeFormInput {
    verificationCode: string
}

const loginSchema = z.object({
    email: z.string().email('正しいメールアドレスを入力してください'),
    password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
})

const loginAndVerifyUserSchema = z.object({
    verificationCode: z.string().min(6, '認証コードは6桁で入力してください'),
})

const registerUserFormConfigs: {
    name: 'email' | 'password'
    type: 'text' | 'email' | 'password'
}[] = [
    {
        name: 'email',
        type: 'email',
    },
    {
        name: 'password',
        type: 'password',
    },
]

export const LoginPage = () => {
    const loginForm = useForm<LoginFormInput>({
        resolver: zodResolver(loginSchema),
    })
    const loginAndVerifyUserForm = useForm<LoginAndVerifyUserCodeFormInput>({
        resolver: zodResolver(loginAndVerifyUserSchema),
    })

    const { signin } = useAuthContext()

    const [isLoading, setIsLoading] = useState(false)
    const [isInActiveUser, setIsInActiveUser] = useState(false)
    const [cacheLoginInfo, setCacheLoginInfo] = useState<LoginFormInput>({
        email: '',
        password: '',
    })

    const router = useRouter()

    const successUser = (response: LoginResponse) => {
        setIsLoading(false)
        signin(response.access_token)
        router.push('/pages/decks')
    }

    const loginUser = async (data: LoginFormInput) => {
        setIsLoading(true)
        try {
            const requestBody: LoginRequest = {
                email: data.email,
                password: data.password,
            }
            const urlParams: UpdateUrlParams = {
                endpoint: 'login',
                body: requestBody,
            }
            const response: LoginResponse = await apiPost(urlParams)
            if (response) {
                successUser(response)
            }
        } catch (error) {
            setIsLoading(false)
            if (
                axios.isAxiosError(error) &&
                error.response &&
                error.response.status === 403
            ) {
                setIsInActiveUser(true)
                setCacheLoginInfo(data)
            }
        }
    }

    const loginAndVerifyUser = async (
        data: LoginAndVerifyUserCodeFormInput,
    ) => {
        setIsLoading(true)
        try {
            const requestBody: LoginAndVerifyRequest = {
                email: cacheLoginInfo.email,
                password: cacheLoginInfo.password,
                verification_code: data.verificationCode,
            }
            const urlParams: UpdateUrlParams = {
                endpoint: 'login-and-user-verify',
                body: requestBody,
            }
            const response: LoginResponse = await apiPost(urlParams)
            if (response) {
                successUser(response)
            }
        } catch (error) {
            setIsLoading(false)
        }
    }

    const onSubmitToLogin: SubmitHandler<LoginFormInput> = async (data) => {
        loginUser(data)
    }

    const onSubmitToLoginAndVerifyUser: SubmitHandler<
        LoginAndVerifyUserCodeFormInput
    > = async (data) => {
        loginAndVerifyUser(data)
    }

    return (
        <BaseAuthForm title="ログイン">
            <form
                onSubmit={
                    isInActiveUser
                        ? loginAndVerifyUserForm.handleSubmit(
                              onSubmitToLoginAndVerifyUser,
                          )
                        : loginForm.handleSubmit(onSubmitToLogin)
                }
                className="px-5"
            >
                <div className="flex flex-col">
                    {!isInActiveUser &&
                        registerUserFormConfigs.map((config) =>
                            config.type === 'password' ? (
                                <PasswordInput
                                    label={config.name}
                                    id={config.name}
                                    register={loginForm.register(config.name)}
                                    error={
                                        loginForm.formState.errors[config.name]
                                    }
                                    disabled={isInActiveUser}
                                    key={config.name}
                                />
                            ) : (
                                <BaseInput
                                    label={config.name}
                                    id={config.name}
                                    type={config.type}
                                    register={loginForm.register(config.name)}
                                    error={
                                        loginForm.formState.errors[config.name]
                                    }
                                    disabled={isInActiveUser}
                                    key={config.name}
                                />
                            ),
                        )}
                    {isInActiveUser && (
                        <BaseInput
                            label="verify code"
                            id="verify-code"
                            register={loginAndVerifyUserForm.register(
                                'verificationCode',
                            )}
                            error={
                                loginAndVerifyUserForm.formState.errors
                                    .verificationCode
                            }
                        />
                    )}
                </div>
                <div className="text-center mt-5">
                    {isLoading ? (
                        <LoadingButton />
                    ) : (
                        <BaseButton
                            label={isInActiveUser ? 'Verify' : 'Login'}
                            handleClick={() => {}}
                            type="submit"
                        />
                    )}
                </div>
            </form>
            <div className="flex justify-center">
                <Link
                    href="/pages/signup"
                    className="flex items-center p-2 tracking-wider text-nav"
                >
                    新規ユーザー登録はこちら
                </Link>
            </div>
        </BaseAuthForm>
    )
}

export default LoginPage
