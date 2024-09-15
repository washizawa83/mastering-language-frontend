'use client'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

type Props = {
    id: string
    label: string
    register: UseFormRegisterReturn
    error?: FieldError
    disabled?: boolean
    initialValue?: string
    placeholder?: string
}

export const BaseTextArea = ({
    id,
    label,
    register,
    error,
    disabled = false,
    initialValue,
    placeholder,
}: Props) => {
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
            <textarea
                className={`bg-transparent border-b-2 focus:outline-none ${error ? 'focus:border-error border-error' : 'focus:border-focus'} p-1 resize-none`}
                id={id}
                {...register}
                disabled={disabled}
                defaultValue={initialValue}
                placeholder={placeholder}
            />
            <span className="text-error text-xs h-4">
                {error && error.message}
            </span>
        </div>
    )
}
