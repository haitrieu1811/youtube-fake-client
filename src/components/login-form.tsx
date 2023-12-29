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
import { LoginSchema, loginSchema } from '@/rules/account.rules'
import { ErrorResponse } from '@/types/utils.types'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

const LoginForm = () => {
  // Form
  const form = useForm<LoginSchema>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(loginSchema)
  })

  const router = useRouter()
  const { setIsAuthenticated, setAccount } = useContext(AppContext)

  // Mutation: Đăng nhập
  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: accountApis.login,
    onSuccess: (data) => {
      const { account } = data.data.data
      setAccount(account)
      setIsAuthenticated(true)
      router.push(PATH.HOME)
      router.refresh()
    },
    onError: (err) => {
      if (isEntityErrror<ErrorResponse<LoginSchema>>(err)) {
        const formErrors = err.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            form.setError(key as keyof LoginSchema, {
              message: formErrors[key as keyof LoginSchema],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  // Đăng nhập
  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data)
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
                  <Input id='email' placeholder='Email' type='text' disabled={loginMutation.isPending} />
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
                  <Input id='password' placeholder='Mật khẩu' type='password' disabled={loginMutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loginMutation.isPending}>
            {loginMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Đăng nhập với email
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
