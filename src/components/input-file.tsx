import toArray from 'lodash/toArray'
import { ChangeEvent, Fragment, ReactNode, useRef } from 'react'
import toast from 'react-hot-toast'

type InputFileProps = {
  children: ReactNode
  onChange?: (file?: File[]) => void
  multiple?: boolean
  maxFileSize?: number
  className?: string
  accept?: string
}

const InputFile = ({
  children,
  onChange,
  multiple = false,
  maxFileSize = 300 * 1024,
  className,
  accept = '.jpg,.jpeg,.png,.webp,.mp4'
}: InputFileProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    inputFileRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filesFromLocal = e.target.files
    const _filesFromLocal = toArray(filesFromLocal)
    const isSizeValid = _filesFromLocal.every((file) => file.size < maxFileSize)
    const isValidFiles = _filesFromLocal.filter((file) => file.size < maxFileSize)
    if (!isSizeValid) toast.error(`Dung lượng file tối đa ${maxFileSize / 1024}KB`)
    onChange && onChange(isValidFiles)
  }

  return (
    <Fragment>
      <input
        hidden
        ref={inputFileRef}
        type='file'
        accept={accept}
        onChange={handleFileChange}
        onClick={(e) => ((e.target as any).value = null)}
        multiple={multiple}
      />
      <div tabIndex={0} role='button' aria-hidden='true' className={className} onClick={handleUpload}>
        {children}
      </div>
    </Fragment>
  )
}

export default InputFile
