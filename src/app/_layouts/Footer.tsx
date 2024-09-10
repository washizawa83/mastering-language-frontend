import { FooterLink } from '@/app/_components/FooterLink'
import { BsStack } from 'react-icons/bs'

export const Footer = () => {
    return (
        <div className="w-full md:hidden fixed bottom-0 bg-profound-light dark:bg-profound-dark">
            <div className="flex items-center justify-around h-12 text-typography-light dark:text-typography-dark">
                <FooterLink
                    label="Deck"
                    link="/pages/deck"
                    icon={<BsStack />}
                />
            </div>
        </div>
    )
}
