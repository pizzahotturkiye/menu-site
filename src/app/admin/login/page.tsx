'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Lock, Mail, Pizza } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Login failed')
      }

      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...')
      
      // Wait a moment for the toast, then redirect
      setTimeout(() => {
        router.push('/admin')
        router.refresh()
      }, 1000)

    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Giriş yapılırken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f97316',
            border: '1px solid rgba(220, 38, 38, 0.3)'
          }
        }}
      />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Pizza className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold pizza-title">
          Pizza Hot
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          Yönetim Paneli Girişi
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-effect border border-red-900/30 py-8 px-4 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                E-posta Adresi
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', { 
                    required: 'E-posta adresi gereklidir',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Geçerli bir e-posta adresi girin'
                    }
                  })}
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-red-900/30'
                  } rounded-md placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-900/50 text-gray-100`}
                  placeholder="admin@pizzapalace.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Şifre
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', { 
                    required: 'Şifre gereklidir',
                    minLength: {
                      value: 6,
                      message: 'Şifre en az 6 karakter olmalıdır'
                    }
                  })}
                  type="password"
                  autoComplete="current-password"
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-red-900/30'
                  } rounded-md placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-900/50 text-gray-100`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                  loading 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-red-500'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Giriş yapılıyor...
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 glass-effect rounded text-gray-300">
                  Demo Giriş Bilgileri
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 glass-effect border border-red-900/30 rounded-md">
              <p className="text-sm text-gray-300">
                <strong>E-posta:</strong> admin@pizzahot.com<br />
                <strong>Şifre:</strong> admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

