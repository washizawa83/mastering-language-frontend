'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldError, SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

import TransitionAlert from '@/app/_components/Alert'
import { BaseAuthForm } from '@/app/_forms/BaseAuthForm'
import { BaseButton } from '@/app/_forms/BaseButton'
import { BaseInput } from '@/app/_forms/BaseInput'
import { LoadingButton } from '@/app/_forms/LoadingButton'
import { PasswordInput } from '@/app/_forms/PasswordInput'
import { apiPost } from '@/app/_service/api'
import { SignUpRequest, VerifyUserRequest } from '@/app/_types/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export interface SignUpFormInput {
    name: string
    email: string
    // password: string
    confirmedPassword: {
        password: string
        confirmPassword: string
    }
}

interface VerifyUserCodeFormInput {
    verificationCode: string
}

const successSignUpMessage =
    'Your code is on the way. To log in, enter the code we emailed.'

const errorVerifyCodeMessage =
    'Invalid verification code provided, Please enter the verification code sent to you again.'

const signUpSchema = z.object({
    name: z
        .string()
        .min(1, '名前は必須です')
        .max(10, '名前は10文字以内で入力してください'),
    email: z.string().email('正しいメールアドレスを入力してください'),
    // password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
    confirmedPassword: z
        .object({
            password: z
                .string()
                .min(6, 'パスワードは6文字以上で入力してください'),
            confirmPassword: z.string(),
        })
        .refine((val) => val.password === val.confirmPassword, {
            message: 'パスワードが一致しません',
            path: ['confirmPassword'],
        }),
})

type RegisterUserFormConfigs = {
    name: 'name' | 'email' | 'password' | 'confirmPassword'
    type: 'text' | 'email' | 'password'
    register:
        | 'name'
        | 'email'
        | 'confirmedPassword.password'
        | 'confirmedPassword.confirmPassword'
    errors?: FieldError
}

const verifyUserSchema = z.object({
    verificationCode: z.string().min(6, '認証コードは6桁で入力してください'),
})

export const SignUpPage = () => {
    const signUpForm = useForm<SignUpFormInput>({
        resolver: zodResolver(signUpSchema),
    })
    const verifyUserForm = useForm<VerifyUserCodeFormInput>({
        resolver: zodResolver(verifyUserSchema),
    })

    const [isLoading, setIsLoading] = useState(false)
    const [isRegisterUser, setIsRegisterUser] = useState(false)
    const [isVerifyError, setIsVerifyError] = useState(false)
    const [email, setEmail] = useState<null | string>(null)

    const router = useRouter()

    const registerUserFormConfigs: RegisterUserFormConfigs[] = [
        {
            name: 'name',
            type: 'text',
            register: 'name',
            errors: signUpForm.formState.errors.name,
        },
        {
            name: 'email',
            type: 'email',
            register: 'email',
            errors: signUpForm.formState.errors.email,
        },
        {
            name: 'password',
            type: 'password',
            register: 'confirmedPassword.password',
            errors: signUpForm.formState.errors.confirmedPassword?.password,
        },
        {
            name: 'confirmPassword',
            type: 'password',
            register: 'confirmedPassword.confirmPassword',
            errors: signUpForm.formState.errors.confirmedPassword
                ?.confirmPassword,
        },
    ]

    const registerUser = async (data: SignUpFormInput) => {
        setIsLoading(true)
        try {
            console.log(data)
            const requestBody: SignUpRequest = {
                username: data.name,
                email: data.email,
                password: data.confirmedPassword.password,
            }
            const response = await apiPost(
                'http://127.0.0.1:8000/signup',
                requestBody,
            )
            setIsLoading(false)
            if (response) {
                setEmail(data.email)
                setIsRegisterUser(true)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    const verifyUser = async (data: VerifyUserCodeFormInput) => {
        if (email === null) return
        setIsLoading(true)
        try {
            const requestBody: VerifyUserRequest = {
                email: email,
                verification_code: data.verificationCode,
            }
            const response = await apiPost(
                'http://127.0.0.1:8000/signup-verify',
                requestBody,
            )
            setIsLoading(false)
            if (response) {
                router.push('/pages/login')
            }
        } catch (error) {
            setIsLoading(false)
            setIsVerifyError(true)
        }
    }

    const onSubmitToSignUp: SubmitHandler<SignUpFormInput> = async (data) => {
        registerUser(data)
    }

    const onSubmitToVerifyUser: SubmitHandler<VerifyUserCodeFormInput> = async (
        data,
    ) => {
        verifyUser(data)
    }

    return (
        <BaseAuthForm title="サインアップ">
            <form
                onSubmit={
                    isRegisterUser
                        ? verifyUserForm.handleSubmit(onSubmitToVerifyUser)
                        : signUpForm.handleSubmit(onSubmitToSignUp)
                }
                className="px-5"
            >
                <div className="flex flex-col">
                    {!isRegisterUser &&
                        registerUserFormConfigs.map((config) =>
                            config.type === 'password' ? (
                                <PasswordInput
                                    label={config.name}
                                    id={config.name}
                                    register={signUpForm.register(
                                        config.register,
                                    )}
                                    error={config.errors}
                                    disabled={isRegisterUser}
                                    key={config.name}
                                />
                            ) : (
                                <BaseInput
                                    label={config.name}
                                    id={config.name}
                                    type={config.type}
                                    register={signUpForm.register(
                                        config.register,
                                    )}
                                    error={config.errors}
                                    disabled={isRegisterUser}
                                    key={config.name}
                                />
                            ),
                        )}
                    {isRegisterUser && (
                        <div>
                            <TransitionAlert
                                message={successSignUpMessage}
                                severity="success"
                            />
                            <BaseInput
                                label="verify code"
                                id="verify-code"
                                register={verifyUserForm.register(
                                    'verificationCode',
                                )}
                                error={
                                    verifyUserForm.formState.errors
                                        .verificationCode
                                }
                            />
                        </div>
                    )}
                </div>
                <div className="text-center mt-5">
                    {isLoading ? (
                        <LoadingButton />
                    ) : (
                        <div>
                            {isVerifyError && (
                                <TransitionAlert
                                    message={errorVerifyCodeMessage}
                                    severity="error"
                                />
                            )}
                            <BaseButton
                                label={isRegisterUser ? 'Verify' : 'Sign Up'}
                                handleClick={() => {}}
                                type="submit"
                            />
                        </div>
                    )}
                </div>
            </form>
            <div className="flex justify-center">
                <Link
                    href="/pages/login"
                    className="flex items-center p-2 tracking-wider text-nav text-sm"
                >
                    ユーザー登録済みの方はこちら
                </Link>
            </div>
        </BaseAuthForm>
    )
}

export default SignUpPage
