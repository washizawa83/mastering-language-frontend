'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

import { BaseAuthForm } from '@/app/_forms/BaseAuthForm'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import { LoadingButton } from '@/app/_forms/LoadingButton'
import { apiPost } from '@/app/_service/api'
import { LoginAndVerifyRequest, LoginRequest } from '@/app/_types/auth'
import { useAuthContext } from '@/app/providers/AuthProvider'
import axios, { AxiosResponse } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCookies } from 'react-cookie'

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

const registerUserFormInfos: {
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
    const [, setCookie] = useCookies(['token'])

    const [isLoading, setIsLoading] = useState(false)
    const [isInActiveUser, setIsInActiveUser] = useState(false)
    const [cacheLoginInfo, setCacheLoginInfo] = useState<LoginFormInput>({
        email: '',
        password: '',
    })

    const router = useRouter()

    const successUser = (response: AxiosResponse) => {
        setIsLoading(false)
        setCookie('token', response.data.access_token, { path: '/' })
        signin()
        router.push('/pages/decks')
    }

    const loginUser = async (data: LoginFormInput) => {
        setIsLoading(true)
        try {
            const requestBody: LoginRequest = {
                email: data.email,
                password: data.password,
            }
            const response = await apiPost(
                'http://127.0.0.1:8000/login',
                requestBody,
            )
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
            const response = await apiPost(
                'http://127.0.0.1:8000/login-and-user-verify',
                requestBody,
            )
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
        <BaseAuthForm title="Login">
            <form
                onSubmit={
                    isInActiveUser
                        ? loginAndVerifyUserForm.handleSubmit(
                              onSubmitToLoginAndVerifyUser,
                          )
                        : loginForm.handleSubmit(onSubmitToLogin)
                }
                className="p-5"
            >
                <div className="flex flex-col">
                    {!isInActiveUser &&
                        registerUserFormInfos.map((info) => (
                            <BaseInput
                                label={info.name}
                                id={info.name}
                                type={info.type}
                                register={loginForm.register(info.name)}
                                error={loginForm.formState.errors[info.name]}
                                disabled={isInActiveUser}
                                key={info.name}
                            />
                        ))}
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
                <div className="text-center mt-8">
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
                    Click here to register as a new user
                </Link>
            </div>
        </BaseAuthForm>
    )
}

export default LoginPage
