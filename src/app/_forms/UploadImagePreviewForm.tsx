import { IconContext } from 'react-icons'
import { RiCloseLargeFill } from 'react-icons/ri'

type ImageData = {
    path: string
    name: string
}

type Props = {
    previewImage: ImageData
    onClickDelete: () => void
}

export const UploadImagePreviewForm = ({
    previewImage,
    onClickDelete,
}: Props) => {
    return (
        <div className="flex border border-flowerBlue p-2">
            <img
                className="object-contain md:h-36 md:w-48 h-16 w-28 rounded-lg"
                src={previewImage.path}
                alt=""
            />
            <p className="grow mr-10 p-2">{previewImage.name}</p>
            <div className="flex justify-center items-center">
                <button
                    onClick={() => onClickDelete()}
                    className="bg-deep-light dark:bg-deep-dark p-2 rounded-lg"
                >
                    <IconContext.Provider value={{ size: '30px' }}>
                        <RiCloseLargeFill />
                    </IconContext.Provider>
                </button>
            </div>
        </div>
    )
}
