import { CardResponse } from '@/app/_types/cards'
import { useState } from 'react'
import { BsBoxArrowUpRight, BsThreeDots } from 'react-icons/bs'
import { IoIosArrowDown } from 'react-icons/io'

type Props = {
    card: CardResponse
}

export const Card = ({ card }: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            key={card.id}
            className="p-3 mb-3 border rounded-lg border-abyssal-light dark:border-abyssal-dark cursor-pointer hover:bg-deep-light hover:dark:bg-deep-dark"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex justify-between items-center">
                <h3 className="grow">{card.sentence}</h3>
                <ul className="flex mr-3 md:mr-5">
                    <li className="border rounded-full border-abyssal-light dark:border-abyssal-dark h-3 w-3 md:h-4 md:w-4 ml-2 bg-[#ff6347]"></li>
                    <li className="border rounded-full border-abyssal-light dark:border-abyssal-dark h-3 w-3 md:h-4 md:w-4 ml-2 bg-[#4f9a4f]"></li>
                    <li className="border rounded-full border-abyssal-light dark:border-abyssal-dark h-3 w-3 md:h-4 md:w-4 ml-2 bg-[#f4eab4]"></li>
                </ul>
                <div>
                    <IoIosArrowDown />
                </div>
            </div>
            {isOpen && (
                <div>
                    <div>{card.meaning}</div>
                    <div className="mt-3 text-pretty text-sm">
                        {card.etymology}
                    </div>
                    <div className="flex item-center mt-3 mx-3">
                        <span className="mr-3">
                            <BsBoxArrowUpRight />
                        </span>
                        <span className="mr-3">
                            <BsThreeDots />
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
