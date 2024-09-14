import { FooterLink } from '@/app/_components/FooterLink'
import { useAuthContext } from '@/app/providers/AuthProvider'
import { BsStack } from 'react-icons/bs'
import { GoHomeFill } from 'react-icons/go'

export const Footer = () => {
    const { isAuth } = useAuthContext()
    return (
        isAuth && (
            <div className="w-full md:hidden fixed bottom-0 bg-profound-light dark:bg-profound-dark">
                <div className="flex items-center justify-around h-12 text-typography-light dark:text-typography-dark">
                    <FooterLink label="ホーム" link="/" icon={<GoHomeFill />} />
                    <FooterLink
                        label="デッキ"
                        link="/pages/decks"
                        icon={<BsStack />}
                    />
                </div>
            </div>
        )
    )
}
