'use client'
import { useTheme } from '@/app/layout'
import { useState } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { IconContext } from 'react-icons'
import { IoIosEyeOff, IoMdEye } from 'react-icons/io'

type Props = {
    id: string
    label: string
    type?: 'text' | 'email' | 'password'
    register: UseFormRegisterReturn
    error?: FieldError
    disabled?: boolean
}

export const PasswordInput = ({
    id,
    label,
    register,
    error,
    disabled = false,
}: Props) => {
    const [isDisable, setIsDisable] = useState(true)
    const { theme } = useTheme()

    return (
        <div className="flex flex-col p-2 w-100">
            <div>
                <label
                    className={`text-lg ${error && 'text-error'}`}
                    htmlFor={id}
                >
                    {label}
                </label>
            </div>
            <div className="flex items-center relative">
                <input
                    className={`grow h-8 bg-transparent border-b-2 focus:outline-none ${error ? 'focus:border-error border-error' : 'focus:border-focus'} p-1`}
                    type={isDisable ? 'password' : 'text'}
                    id={id}
                    {...register}
                    disabled={disabled}
                />
                <span
                    className={'h-8 absolute right-0'}
                    onClick={() => setIsDisable(!isDisable)}
                >
                    <IconContext.Provider
                        value={{
                            size: '20px',
                            color: `${theme === 'dark' && '#ddd'}`,
                        }}
                    >
                        {isDisable ? <IoMdEye /> : <IoIosEyeOff />}
                    </IconContext.Provider>
                </span>
            </div>
            <span className="text-error text-xs h-4">
                {error && error.message}
            </span>
        </div>
    )
}
