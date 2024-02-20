'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'
import { Loader2 } from 'lucide-react'
import { useContext, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import accountApis from '@/apis/account.apis'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { isEntityErrror } from '@/lib/utils'
import { AppContext } from '@/providers/app-provider'
import { UpdateMeSchema, updateMeSchema } from '@/rules/account.rules'
import { ErrorResponse } from '@/types/utils.types'
import Branding from './branding'

const CustomClient = () => {
  const { setAccount } = useContext(AppContext)

  // Form
  const form = useForm<UpdateMeSchema>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      channelName: '',
      username: '',
      bio: ''
    }
  })

  // Query: Get channel info
  const getMeQuery = useQuery({
    queryKey: ['getMe'],
    queryFn: () => accountApis.getMe()
  })

  // Channel info
  const me = useMemo(() => getMeQuery.data?.data.data.me, [getMeQuery.data?.data.data.me])

  // Mutation: Update channel
  const updateMeMutation = useMutation({
    mutationKey: ['updateMe'],
    mutationFn: accountApis.updateMe,
    onSuccess: (data) => {
      const { account } = data.data.data
      setAccount(account)
      getMeQuery.refetch()
      toast.success('Đã lưu thay đổi')
    },
    onError: (error) => {
      if (isEntityErrror<ErrorResponse<Record<keyof UpdateMeSchema, string>>>(error)) {
        const formErrors = error.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).map((key) => {
            form.setError(key as keyof UpdateMeSchema, {
              message: formErrors[key as keyof UpdateMeSchema],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  // Set form
  useEffect(() => {
    if (!me) return
    form.setValue('channelName', me.channelName)
    form.setValue('username', me.username)
    form.setValue('bio', me.bio)
  }, [me, form.setValue])

  // Submit
  const onSubmit = form.handleSubmit((data) => {
    if (!me) return
    const omitFields: string[] = []
    Object.keys(data).forEach((key) => {
      if (data[key as keyof UpdateMeSchema] === me[key as keyof UpdateMeSchema]) omitFields.push(key)
    })
    updateMeMutation.mutate(omit(data, omitFields))
  })

  // Hủy bỏ thay đổi
  const handleCancel = () => {
    if (!me) return
    form.setValue('channelName', me.channelName)
    form.setValue('username', me.username)
    form.setValue('bio', me.bio)
  }

  return (
    <div className='p-6'>
      <h1 className='text-[25px] font-medium tracking-tight mb-6'>Tùy chỉnh kênh</h1>
      <Tabs defaultValue='branding'>
        <TabsList>
          <TabsTrigger value='branding'>Xây dựng thương hiệu</TabsTrigger>
          <TabsTrigger value='basicInfo'>Thông tin cơ bản</TabsTrigger>
        </TabsList>
        <TabsContent value='basicInfo' className='w-2/3 py-6'>
          {me && (
            <Form {...form}>
              <form onSubmit={onSubmit} className='space-y-10'>
                {/* Tên kênh */}
                <FormField
                  control={form.control}
                  name='channelName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Nhập tên kênh' {...field} />
                      </FormControl>
                      <FormDescription>
                        Chọn tên kênh thể hiện cá tính và nội dung của bạn. Những thay đổi về tên và hình đại diện của
                        bạn chỉ xuất hiện trên YouTube và không xuất hiện trên các dịch vụ khác của Google. Bạn có thể
                        đổi tên hai lần trong 14 ngày.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Tên người dùng */}
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên người dùng</FormLabel>
                      <FormControl>
                        <Input type='text' placeholder='Nhập tên người dùng' {...field} />
                      </FormControl>
                      <FormDescription>
                        Thêm chữ cái và số để chọn tên người dùng duy nhất. Bạn có thể đổi về tên người dùng cũ trong
                        vòng 14 ngày. Bạn có thể thay đổi tên người dùng 2 lần trong mỗi 14 ngày.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Thông tin mô tả */}
                <FormField
                  control={form.control}
                  name='bio'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thông tin mô tả</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={8} placeholder='Nhập thông tin mô tả' className='resize-none' />
                      </FormControl>
                      <FormDescription>
                        Giới thiệu với người xem về kênh của bạn. Nội dung mô tả sẽ xuất hiện trong phần Giới thiệu
                        kênh, trong kết quả tìm kiếm và nhiều vị trí khác.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Submit */}
                <div className='flex items-center space-x-2'>
                  <Button type='button' variant='ghost' className='uppercase' onClick={handleCancel}>
                    Hủy bỏ
                  </Button>
                  <Button
                    type='submit'
                    disabled={updateMeMutation.isPending}
                    className='rounded-sm bg-blue-500 hover:bg-blue-600 uppercase'
                  >
                    {updateMeMutation.isPending && <Loader2 className='w-4 h-4 mr-3 animate-spin' />}
                    Xuất bản
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </TabsContent>
        <TabsContent value='branding' className='w-1/2 py-6 space-y-10'>
          <Branding infoMe={me} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomClient
