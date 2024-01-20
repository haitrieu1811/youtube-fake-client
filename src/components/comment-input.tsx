'use client'

import classNames from 'classnames'
import { Loader2 } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'

import { Button } from './ui/button'

type CommentInputProps = {
  autoFocus?: boolean
  value?: string
  actionText?: string
  cancelText?: string
  placeholderText?: string
  classNameInput?: string
  isPending?: boolean
  onCancel?: () => void
  onSubmit: (content: string) => void
}

const CommentInput = ({
  autoFocus = false,
  value = '',
  actionText = 'Bình luận',
  cancelText = 'Hủy',
  classNameInput = '',
  placeholderText = 'Viết bình luận',
  isPending = false,
  onCancel,
  onSubmit
}: CommentInputProps) => {
  const [content, setContent] = useState<string>(value)
  const [isCommenting, setIsCommenting] = useState<boolean>(false)

  // Bắt đầu bình luận
  const startComment = () => {
    setIsCommenting(true)
  }

  // Dừng bình luận
  const stopComment = () => {
    setIsCommenting(false)
    setContent('')
    onCancel && onCancel()
  }

  // Thay đổi nội dung bình luận khi nhập
  const handleChangeContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  // Submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim()) return
    onSubmit && onSubmit(content)
    stopComment()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        autoFocus={autoFocus}
        placeholder={placeholderText}
        value={content}
        className={classNames({
          'outline-none w-full placeholder:text-muted-foreground border-b border-b-border bg-transparent': true,
          [classNameInput]: !!classNameInput
        })}
        onChange={handleChangeContent}
        onFocus={startComment}
      />
      {isCommenting && (
        <div className='flex justify-end items-center space-x-3 mt-2'>
          <Button type='button' variant='ghost' className='rounded-full' onClick={stopComment}>
            {cancelText}
          </Button>
          <Button
            type='submit'
            disabled={!content || isPending}
            className='rounded-full bg-blue-700 hover:bg-blue-800 text-white'
          >
            {isPending && <Loader2 className='w-4 h-4 mr-3 animate-spin' />}
            {actionText}
          </Button>
        </div>
      )}
    </form>
  )
}

export default CommentInput
