import { DateNumberInput } from '@/app/_forms/DateNumberInput'
import { oblivionCurveInput } from '@/app/pages/settings/oblivion-curve/page'
import { UseFormReturn } from 'react-hook-form'

type Props = {
    level:
        | 'levelOne'
        | 'levelTwo'
        | 'levelThree'
        | 'levelFour'
        | 'levelFive'
        | 'levelSix'
        | 'levelSeven'
    form: UseFormReturn<oblivionCurveInput, any, undefined>
}

const subFormNames = ['month', 'day', 'hour'] as const

const convertUnit = {
    month: 'ヶ月',
    day: '日',
    hour: '時間',
}

const maxNumberPerUnit = {
    month: 12,
    day: 31,
    hour: 24,
}

export const OblivionCurveDateInput = ({ level, form }: Props) => {
    return subFormNames.map((name) => (
        <DateNumberInput
            unit={convertUnit[name]}
            maxNumber={maxNumberPerUnit[name]}
            register={form.register(`${level}.${name}`, {
                valueAsNumber: true,
            })}
            key={`${level}-${name}`}
        />
    ))
}
