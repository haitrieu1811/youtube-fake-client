import type { Metadata } from 'next'

import RegisterForm from '@/components/register-form'

export const metadata: Metadata = {
  title: 'Đăng ký',
  description: 'Đăng ký tài khoản'
}

const Register = () => {
  return (
    <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Đăng ký</h1>
        <p className='text-sm text-muted-foreground'>Nhập email và mật khẩu để đăng ký</p>
      </div>
      <RegisterForm />
    </div>
  )
}

export default Register
