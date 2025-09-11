'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Pizza, Leaf, Award, Shield, Flame, Star } from 'lucide-react'

interface Ingredient {
  id: string
  name: string
  nameTr: string
  allergen: boolean
}

interface MenuItemIngredient {
  ingredient: Ingredient
}

interface MenuItem {
  id: string
  name: string
  nameTr: string
  description?: string
  descriptionTr?: string
  price: number
  image?: string
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  ingredients: MenuItemIngredient[]
}

interface Category {
  id: string
  name: string
  nameTr: string
  description?: string
  descriptionTr?: string
  image?: string
  menuItems: MenuItem[]
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ingredientsDialogItem, setIngredientsDialogItem] = useState<MenuItem | null>(null)

  const openIngredientsDialog = (item: MenuItem) => {
    setIngredientsDialogItem(item)
  }

  const closeIngredientsDialog = () => {
    setIngredientsDialogItem(null)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Menü yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center glass-effect p-8 rounded-2xl border border-red-900/30">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-6 glow-effect"></div>
          <p className="text-gray-300 text-xl">🔥 Ateşli menümüz yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center glass-effect p-8 rounded-2xl border border-red-900/30">
          <p className="text-red-400 mb-6 text-xl">{error}</p>
          <button 
            onClick={fetchCategories}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-red-500 hover:to-orange-500 transition-all duration-300 glow-effect transform hover:scale-105"
          >
            🔄 Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/5 rounded-full blur-lg animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-500/5 rounded-full blur-md animate-pulse animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 pizza-title">
             PIZZA MENÜMÜZ
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            500°C Alevli Fırında Pişirilen Eşsiz Acılı Pizzalarımız 🌶️
          </p>
          
        </div>
      </section>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="glass-effect p-12 rounded-2xl border border-red-900/30 max-w-2xl mx-auto">
              <Pizza className="h-16 w-16 text-orange-400 mx-auto mb-6" />
              <p className="text-gray-300 text-xl mb-8">Henüz ateşli pizza menümüz hazırlanıyor...</p>
              <Link 
                href="/admin" 
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-red-500 hover:to-orange-500 transition-all duration-300 glow-effect transform hover:scale-105"
              >
                🔧 Yönetim Paneline Git
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((category) => (
              <section key={category.id} className="glass-effect rounded-2xl overflow-hidden border border-red-900/30">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-3 md:p-4">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-yellow-300" />
                    <h2 className="text-xl md:text-2xl font-bold">{category.nameTr}</h2>
                  </div>
                  {category.descriptionTr && (
                    <p className="text-orange-100 mt-1 text-xs md:text-sm">{category.descriptionTr}</p>
                  )}
                </div>
                
                {category.menuItems.length === 0 ? (
                  <div className="p-12 text-center">
                    <Pizza className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                    <p className="text-gray-300 text-lg">Bu kategoride henüz ateşli pizza bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="p-6 md:p-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
                      {category.menuItems.map((item) => (
                        <div key={item.id} className="glass-effect border border-red-900/30 rounded-xl p-5 flex flex-col h-full hover:border-orange-500/50 transition-all duration-300">
                          {item.image && (
                            <div className="relative mb-4 rounded-lg overflow-hidden border border-red-900/30 bg-black/30 aspect-[4/3]">
                              <Image
                                src={item.image}
                                alt={item.nameTr}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-orange-400">{item.nameTr}</h3>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-yellow-400">₺{item.price.toFixed(2)}</span>
                              <div className="flex gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-3 w-3 text-orange-500 fill-current" />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {item.descriptionTr && (
                            <p className="text-gray-300 mb-4 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.descriptionTr}</p>
                          )}
                          
                          {/* Dietary indicators */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.isVegetarian && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-600/20 text-green-400 border border-green-600/30">
                                <Leaf className="h-3 w-3 mr-1" />
                                Vejetaryen
                              </span>
                            )}
                            {item.isVegan && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-emerald-600/20 text-emerald-400 border border-emerald-600/30">
                                <Award className="h-3 w-3 mr-1" />
                                Vegan
                              </span>
                            )}
                            {item.isGlutenFree && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-600/20 text-blue-400 border border-blue-600/30">
                                <Shield className="h-3 w-3 mr-1" />
                                Glutensiz
                              </span>
                            )}
                          </div>
                          
                          {/* Ingredients */}
                          <div className="mt-auto">
                            {item.ingredients.length > 0 && (
                              <div className="text-sm text-gray-400 bg-gray-900/30 p-3 rounded-lg border border-gray-700/30 flex items-center gap-2 overflow-hidden">
                                <span className="font-medium text-orange-400 flex-shrink-0">🧄 İçindekiler:</span>
                                <span className="truncate flex-1 min-w-0">
                                  {item.ingredients.map((ingredient, index) => (
                                    <span key={ingredient.ingredient.id}>
                                      {ingredient.ingredient.nameTr}
                                      {ingredient.ingredient.allergen && (
                                        <span className="text-red-400 ml-1">*</span>
                                      )}
                                      {index < item.ingredients.length - 1 && ', '}
                                    </span>
                                  ))}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openIngredientsDialog(item)}
                                  className="text-xs font-medium text-orange-400 hover:text-orange-300 underline flex-shrink-0"
                                >
                                  Tümünü Gör
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
        
        {/* Allergen note */}
        <div className="mt-12 glass-effect p-8 rounded-2xl border border-yellow-600/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yellow-500/20 p-3 rounded-full">
              <Shield className="h-6 w-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-yellow-400">⚠️ Alerjen Uyarısı</h3>
          </div>
          <p className="text-gray-300 leading-relaxed">
            <span className="font-bold text-yellow-400">Önemli Not:</span> (*) işareti olan malzemeler alerjen içerebilir. 
            Herhangi bir gıda alerjiniz varsa lütfen sipariş vermeden önce personelimizi bilgilendiriniz. 
            Sağlığınız bizim için çok önemli! 🚨
          </p>
        </div>
      </div>

      {/* Ingredients Dialog */}
      {ingredientsDialogItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={closeIngredientsDialog}></div>
          <div className="relative bg-gray-950 text-gray-100 w-full max-w-lg rounded-2xl border border-gray-700/50 shadow-2xl glass-effect">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-yellow-300" />
                <h4 className="text-lg font-bold">{ingredientsDialogItem.nameTr} — İçindekiler</h4>
              </div>
              <button onClick={closeIngredientsDialog} className="text-white/90 hover:text-white">✕</button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {ingredientsDialogItem.descriptionTr && (
                <p className="text-gray-300 mb-4 leading-relaxed">{ingredientsDialogItem.descriptionTr}</p>
              )}
              <div className="space-y-2">
                {ingredientsDialogItem.ingredients.map((ingredient) => (
                  <div key={ingredient.ingredient.id} className="flex items-center justify-between bg-gray-900/40 border border-gray-700/40 rounded-lg p-3">
                    <span className="text-gray-200">
                      {ingredient.ingredient.nameTr}
                      {ingredient.ingredient.allergen && <span className="text-red-400 ml-1">*</span>}
                    </span>
                    {ingredient.ingredient.allergen ? (
                      <span className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-300 border border-red-600/30">Alerjen</span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-600/30">Güvenli</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 flex justify-end">
              <button
                onClick={closeIngredientsDialog}
                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-5 py-2 rounded-lg font-semibold hover:from-red-500 hover:to-orange-500"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
