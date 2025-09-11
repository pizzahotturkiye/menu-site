'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Pizza, Plus, Edit, Trash2, Save, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import AuthGuard from '@/components/AuthGuard'

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
  isActive: boolean
  isVegetarian: boolean
  isVegan: boolean
  isGlutenFree: boolean
  categoryId: string
  ingredients: MenuItemIngredient[]
}

interface Category {
  id: string
  name: string
  nameTr: string
  description?: string
  descriptionTr?: string
  image?: string
  isActive: boolean
  menuItems: MenuItem[]
}

type FormData = {
  name: string
  nameTr: string
  description?: string
  descriptionTr?: string
  price?: number
  categoryId?: string
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  ingredients?: string[]
  image?: string
}

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showMenuItemForm, setShowMenuItemForm] = useState(false)
  const [showIngredientForm, setShowIngredientForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>()
  const { register: registerIngredient, handleSubmit: handleIngredientSubmit, reset: resetIngredient } = useForm<{ name: string; nameTr: string; allergen: boolean }>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, ingredientsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/ingredients')
      ])
      
      const categoriesData = await categoriesRes.json()
      const ingredientsData = await ingredientsRes.json()
      
      setCategories(categoriesData)
      setIngredients(ingredientsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Veri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) throw new Error('Failed to upload image')
      
      const result = await response.json()
      return result.filename
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Resim yüklenirken hata oluştu')
      return null
    }
  }

  const onSubmitCategory = async (data: FormData) => {
    try {
      let imageUrl = data.image
      
      // Handle image upload if file is selected
      const fileInput = document.querySelector('#category-image') as HTMLInputElement
      if (fileInput?.files?.[0]) {
        const uploadedImage = await uploadImage(fileInput.files[0])
        if (uploadedImage) {
          imageUrl = uploadedImage
        }
      }
      
      const submitData = { ...data, image: imageUrl }
      
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) throw new Error('Failed to save category')

      toast.success(editingCategory ? 'Kategori güncellendi' : 'Kategori oluşturuldu')
      setShowCategoryForm(false)
      setEditingCategory(null)
      reset()
      fetchData()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Kategori kaydedilirken hata oluştu')
    }
  }

  const onSubmitMenuItem = async (data: FormData) => {
    try {
      let imageUrl = data.image
      
      // Handle image upload if file is selected
      const fileInput = document.querySelector('#menuitem-image') as HTMLInputElement
      if (fileInput?.files?.[0]) {
        const uploadedImage = await uploadImage(fileInput.files[0])
        if (uploadedImage) {
          imageUrl = uploadedImage
        }
      }
      
      const submitData = { ...data, image: imageUrl }
      
      const url = editingMenuItem ? `/api/menu-items/${editingMenuItem.id}` : '/api/menu-items'
      const method = editingMenuItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) throw new Error('Failed to save menu item')

      toast.success(editingMenuItem ? 'Ürün güncellendi' : 'Ürün oluşturuldu')
      setShowMenuItemForm(false)
      setEditingMenuItem(null)
      reset()
      fetchData()
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Ürün kaydedilirken hata oluştu')
    }
  }

  const onSubmitIngredient = async (data: { name: string; nameTr: string; allergen: boolean }) => {
    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to save ingredient')

      toast.success('Malzeme oluşturuldu')
      setShowIngredientForm(false)
      resetIngredient()
      fetchData()
    } catch (error) {
      console.error('Error saving ingredient:', error)
      toast.error('Malzeme kaydedilirken hata oluştu')
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete category')

      toast.success('Kategori silindi')
      fetchData()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Kategori silinirken hata oluştu')
    }
  }

  const deleteMenuItem = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/menu-items/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete menu item')

      toast.success('Ürün silindi')
      fetchData()
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Ürün silinirken hata oluştu')
    }
  }

  const editCategory = (category: Category) => {
    setEditingCategory(category)
    setValue('name', category.name)
    setValue('nameTr', category.nameTr)
    setValue('description', category.description || '')
    setValue('descriptionTr', category.descriptionTr || '')
    setShowCategoryForm(true)
  }

  const editMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item)
    setValue('name', item.name)
    setValue('nameTr', item.nameTr)
    setValue('description', item.description || '')
    setValue('descriptionTr', item.descriptionTr || '')
    setValue('price', item.price)
    setValue('categoryId', item.categoryId)
    setValue('isVegetarian', item.isVegetarian)
    setValue('isVegan', item.isVegan)
    setValue('isGlutenFree', item.isGlutenFree)
    setValue('ingredients', item.ingredients.map(i => i.ingredient.id))
    setShowMenuItemForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center glass-effect p-8 rounded-2xl border border-red-900/30">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-6 glow-effect"></div>
          <p className="text-gray-300 text-xl">🔥 Yönetim paneli yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-600/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/5 rounded-full blur-lg animate-pulse animation-delay-1000"></div>
        </div>

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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="mb-12">
            <h1 className="text-5xl font-bold pizza-title mb-4">🔥 Pizza Hot Yönetim</h1>
            <p className="text-xl text-gray-300">Malatya'nın en ateşli pizza menüsünü yönetin</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-6 mb-12">
            <button
              onClick={() => setShowCategoryForm(true)}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl hover:from-red-500 hover:to-orange-500 transition-all duration-300 flex items-center gap-3 font-bold glow-effect transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              🍕 Kategori Ekle
            </button>
            <button
              onClick={() => setShowMenuItemForm(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 flex items-center gap-3 font-bold glow-effect transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              🌶️ Ürün Ekle
            </button>
            <button
              onClick={() => setShowIngredientForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-3 font-bold glow-effect transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              🧄 Malzeme Ekle
            </button>
          </div>

          {/* Categories List */}
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.id} className="glass-effect rounded-2xl overflow-hidden border border-red-900/30">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{category.nameTr}</h3>
                    {category.descriptionTr && (
                      <p className="text-orange-100 mt-2">{category.descriptionTr}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => editCategory(category)}
                      className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 group"
                    >
                      <Edit className="h-5 w-5 group-hover:scale-110" />
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="p-3 text-white hover:bg-red-500/50 rounded-xl transition-all duration-300 group"
                    >
                      <Trash2 className="h-5 w-5 group-hover:scale-110" />
                    </button>
                  </div>
                </div>
              
                <div className="p-6">
                  {category.menuItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Pizza className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">Bu kategoride henüz ürün bulunmuyor</p>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {category.menuItems.map((item) => (
                        <div key={item.id} className="glass-effect border border-red-900/20 rounded-xl p-6 hover:border-orange-500/40 transition-all duration-300">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-orange-400 mb-2">{item.nameTr}</h4>
                              <p className="text-gray-300 mb-3 leading-relaxed">{item.descriptionTr}</p>
                              <p className="text-2xl font-bold text-yellow-400">₺{item.price.toFixed(2)}</p>
                              <div className="flex gap-2 mt-3">
                                {item.isVegetarian && (
                                  <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs border border-green-600/30">
                                    🌱 Vejetaryen
                                  </span>
                                )}
                                {item.isVegan && (
                                  <span className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-xs border border-emerald-600/30">
                                    🌿 Vegan
                                  </span>
                                )}
                                {item.isGlutenFree && (
                                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs border border-blue-600/30">
                                    🛡️ Glutensiz
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-3 ml-6">
                              <button
                                onClick={() => editMenuItem(item)}
                                className="p-3 text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-300 group border border-blue-500/30"
                              >
                                <Edit className="h-5 w-5 group-hover:scale-110" />
                              </button>
                              <button
                                onClick={() => deleteMenuItem(item.id)}
                                className="p-3 text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300 group border border-red-500/30"
                              >
                                <Trash2 className="h-5 w-5 group-hover:scale-110" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
              </h2>
              <button
                onClick={() => {
                  setShowCategoryForm(false)
                  setEditingCategory(null)
                  reset()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitCategory)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İngilizce İsim
                </label>
                <input
                  {...register('name', { required: true })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Category Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Türkçe İsim
                </label>
                <input
                  {...register('nameTr', { required: true })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Kategori Adı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İngilizce Açıklama
                </label>
                <textarea
                  {...register('description')}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Category Description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Türkçe Açıklama
                </label>
                <textarea
                  {...register('descriptionTr')}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Kategori Açıklaması"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Resmi
                </label>
                <input
                  type="file"
                  id="category-image"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingCategory ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false)
                    setEditingCategory(null)
                    reset()
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Item Form Modal */}
      {showMenuItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingMenuItem ? 'Ürün Düzenle' : 'Yeni Ürün'}
              </h2>
              <button
                onClick={() => {
                  setShowMenuItemForm(false)
                  setEditingMenuItem(null)
                  reset()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitMenuItem)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İngilizce İsim
                  </label>
                  <input
                    {...register('name', { required: true })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Product Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Türkçe İsim
                  </label>
                  <input
                    {...register('nameTr', { required: true })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ürün Adı"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { required: true, min: 0 })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    {...register('categoryId', { required: true })}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nameTr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İngilizce Açıklama
                </label>
                <textarea
                  {...register('description')}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Product Description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Türkçe Açıklama
                </label>
                <textarea
                  {...register('descriptionTr')}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  placeholder="Ürün Açıklaması"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özellikler
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      {...register('isVegetarian')}
                      className="mr-2"
                    />
                    Vejetaryen
                  </label>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      {...register('isVegan')}
                      className="mr-2"
                    />
                    Vegan
                  </label>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      {...register('isGlutenFree')}
                      className="mr-2"
                    />
                    Glutensiz
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Malzemeler
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
                  {ingredients.map((ingredient) => (
                    <label key={ingredient.id} className="flex items-center mb-1 text-gray-700">
                      <input
                        type="checkbox"
                        value={ingredient.id}
                        {...register('ingredients')}
                        className="mr-2"
                      />
                      {ingredient.nameTr} {ingredient.allergen && <span className="text-red-500">*</span>}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Resmi
                </label>
                <input
                  type="file"
                  id="menuitem-image"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingMenuItem ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenuItemForm(false)
                    setEditingMenuItem(null)
                    reset()
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ingredient Form Modal */}
      {showIngredientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Yeni Malzeme</h2>
              <button
                onClick={() => {
                  setShowIngredientForm(false)
                  resetIngredient()
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleIngredientSubmit(onSubmitIngredient)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İngilizce İsim
                </label>
                <input
                  {...registerIngredient('name', { required: true })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ingredient Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Türkçe İsim
                </label>
                <input
                  {...registerIngredient('nameTr', { required: true })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Malzeme Adı"
                />
              </div>
              
              <div>
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    {...registerIngredient('allergen')}
                    className="mr-2"
                  />
                  Alerjen İçerir
                </label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowIngredientForm(false)
                    resetIngredient()
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  )
}
