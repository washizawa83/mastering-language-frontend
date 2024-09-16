import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import { IconContext } from 'react-icons'
import { RiImageAddLine } from 'react-icons/ri'

type Props = {
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T
}

export const UploadImageForm = ({ getRootProps, getInputProps }: Props) => {
    return (
        <div className="flex justify-center w-full">
            <div className="flex grow justify-center">
                <div
                    className="w-full border-dashed border border-flowerBlue flex justify-center p-5 mb-2 cursor-pointer"
                    {...getRootProps()}
                >
                    <input
                        {...getInputProps()}
                        accept=".jpg, .jpeg, .png, .bmp"
                    />
                    <div className="container flex justify-center text-xs">
                        <div className="flex flex-col items-center justify-center opacity-70">
                            <IconContext.Provider value={{ size: '30px' }}>
                                <RiImageAddLine />
                            </IconContext.Provider>
                            <p className="text-sm mt-5">
                                画像を選択またはドラッグ&ドロップ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
