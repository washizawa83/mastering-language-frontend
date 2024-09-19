import { UseFormRegisterReturn } from 'react-hook-form'

type Props = {
    unit: string
    maxNumber: number
    register: UseFormRegisterReturn
}

export const DateNumberInput = ({ unit, maxNumber, register }: Props) => {
    return (
        <div>
            <label htmlFor="" className="flex">
                <input
                    type="number"
                    className={`w-10 bg-transparent border-b-2 focus:outline-none focus:border-focus text-center`}
                    {...register}
                    defaultValue={0}
                    max={maxNumber}
                    min={0}
                />
                <span className="text-sm content-end">{unit}</span>
            </label>
        </div>
    )
}
