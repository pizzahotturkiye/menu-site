'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pizza } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function AuthGuard({ children, requiredRole = 'admin' }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          if (requiredRole && data.user.role !== requiredRole) {
            setError('Bu sayfaya erişim yetkiniz bulunmamaktadır')
            router.push('/admin/login')
            return
          }
          setUser(data.user)
        } else {
          router.push('/admin/login')
        }
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setError('Kimlik doğrulama hatası')
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kimlik doğrulanıyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Pizza className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Giriş Sayfasına Dön
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirecting...
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* User info bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center text-sm text-gray-600">
              <span>Hoş geldiniz, {user.name}</span>
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  )
}

