'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, Loader2 } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'

import videoApis from '@/apis/video.apis'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger
} from './ui/alert-dialog'
import { Button } from './ui/button'

type SubscribeButtonProps = {
  channelId: string
  channelName: string
  isSubscribedBefore: boolean
  onSubscribeSuccess?: () => void
  onUnsubscribeSuccess?: () => void
}

const SubscribeButton = ({
  channelId,
  isSubscribedBefore,
  channelName,
  onSubscribeSuccess,
  onUnsubscribeSuccess
}: SubscribeButtonProps) => {
  const queryClient = useQueryClient()
  const [isSubscribed, setIsSubscribed] = useState<boolean>(isSubscribedBefore)

  useEffect(() => setIsSubscribed(isSubscribedBefore), [isSubscribedBefore])

  // Mutation: Đăng ký kênh
  const subscribeMutation = useMutation({
    mutationKey: ['subscribe'],
    mutationFn: videoApis.subscribe,
    onSuccess: () => {
      setIsSubscribed(true)
      queryClient.invalidateQueries({ queryKey: ['getSubscribedChannels'] })
      onSubscribeSuccess && onSubscribeSuccess()
    }
  })

  // Mutation: Hủy đăng ký kênh
  const unsubscribeMutation = useMutation({
    mutationKey: ['unsubscribe'],
    mutationFn: videoApis.unsubscribe,
    onSuccess: () => {
      setIsSubscribed(false)
      queryClient.invalidateQueries({ queryKey: ['getSubscribedChannels'] })
      onUnsubscribeSuccess && onUnsubscribeSuccess()
    }
  })

  // Đăng ký kênh
  const handleSubscribe = () => {
    if (isSubscribed) return
    subscribeMutation.mutate(channelId)
  }

  // Hủy đăng ký kênh
  const handleUnsubscribe = () => {
    if (!isSubscribed) return
    unsubscribeMutation.mutate(channelId)
  }

  return (
    <Fragment>
      {!isSubscribed && (
        <Button disabled={subscribeMutation.isPending} className='rounded-full' onClick={handleSubscribe}>
          {subscribeMutation.isPending && <Loader2 className='w-4 h-4 mr-3 animate-spin' />}
          Đăng ký
        </Button>
      )}
      {isSubscribed && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='secondary' className='rounded-full space-x-3'>
              <Bell size={18} strokeWidth={1.5} />
              <span>Đã đăng ký</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='max-w-xs'>
            <AlertDialogHeader>
              <AlertDialogDescription className='pb-6'>Hủy đăng ký {channelName}?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='rounded-full'>Hủy</AlertDialogCancel>
              <AlertDialogAction
                disabled={unsubscribeMutation.isPending}
                className='rounded-full'
                onClick={handleUnsubscribe}
              >
                {unsubscribeMutation.isPending && <Loader2 className='w-3 h-3 mr-2 animate-spin' />}
                Hủy đăng ký
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Fragment>
  )
}

export default SubscribeButton
