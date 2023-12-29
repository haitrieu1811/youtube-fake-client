'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import isEmpty from 'lodash/isEmpty'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'

import accountApis from '@/apis/account.apis'
import PATH from '@/constants/path'
import { isEntityErrror } from '@/lib/utils'
import { AppContext } from '@/providers/app-provider'
import { RegisterSchema, registerSchema } from '@/rules/account.rules'
import { ErrorResponse } from '@/types/utils.types'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

const RegisterForm = () => {
  // Form
  const form = useForm<RegisterSchema>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    resolver: zodResolver(registerSchema)
  })

  const router = useRouter()
  const { setIsAuthenticated, setAccount } = useContext(AppContext)

  // Mutation: Đăng ký
  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: accountApis.register,
    onSuccess: (data) => {
      const { account } = data.data.data
      setAccount(account)
      setIsAuthenticated(true)
      router.push(PATH.HOME)
      router.refresh()
    },
    onError: (err) => {
      if (isEntityErrror<ErrorResponse<RegisterSchema>>(err)) {
        const formErrors = err.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            form.setError(key as keyof RegisterSchema, {
              message: formErrors[key as keyof RegisterSchema],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  // Đăng ký
  const onSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data)
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className='grid gap-2'>
          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem {...field}>
                <FormLabel className='sr-only' htmlFor='email'>
                  Email
                </FormLabel>
                <FormControl>
                  <Input id='email' placeholder='Email' type='text' disabled={registerMutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Mật khẩu */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem {...field}>
                <FormLabel className='sr-only' htmlFor='password'>
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <Input id='password' placeholder='Mật khẩu' type='password' disabled={registerMutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Nhập lại mật khẩu */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem {...field}>
                <FormLabel className='sr-only' htmlFor='confirmPassword'>
                  Nhập lại mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    id='confirmPassword'
                    placeholder='Nhập lại mật khẩu'
                    type='password'
                    disabled={registerMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={registerMutation.isPending}>
            {registerMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Đăng ký với email
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterForm
