'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Pizza, Plus, Edit, Trash2, Save, X, LayoutDashboard, FolderTree, Search, Filter } from 'lucide-react'
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

  const [activeView, setActiveView] = useState<'dashboard' | 'categories' | 'products' | 'ingredients'>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategoryId, setFilterCategoryId] = useState<string>('')

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

  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  const allMenuItems: MenuItem[] = categories.flatMap((c) => c.menuItems)
  const filteredMenuItems: MenuItem[] = allMenuItems.filter((item) => {
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = query === '' ||
      item.nameTr.toLowerCase().includes(query) ||
      (item.descriptionTr || '').toLowerCase().includes(query)
    const matchesCategory = !filterCategoryId || item.categoryId === filterCategoryId
    return matchesSearch && matchesCategory
  })

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
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden md:block w-64">
              <div className="glass-effect border border-red-900/30 rounded-2xl p-4 space-y-2">
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeView === 'dashboard' ? 'bg-red-900/30 text-orange-400' : 'hover:bg-red-900/20 text-gray-300'}`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveView('categories')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeView === 'categories' ? 'bg-red-900/30 text-orange-400' : 'hover:bg-red-900/20 text-gray-300'}`}
                >
                  <FolderTree className="h-5 w-5" />
                  <span>Kategoriler</span>
                </button>
                <button
                  onClick={() => setActiveView('products')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeView === 'products' ? 'bg-red-900/30 text-orange-400' : 'hover:bg-red-900/20 text-gray-300'}`}
                >
                  <Pizza className="h-5 w-5" />
                  <span>Ürünler</span>
                </button>
                <button
                  onClick={() => setActiveView('ingredients')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${activeView === 'ingredients' ? 'bg-red-900/30 text-orange-400' : 'hover:bg-red-900/20 text-gray-300'}`}
                >
                  <Filter className="h-5 w-5 rotate-90" />
                  <span>Malzemeler</span>
                </button>
              </div>
            </aside>

            {/* Main content */}
            <section className="flex-1">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold pizza-title mb-2">Pizza Hot Yönetim paneli</h1>
                <p className="text-gray-300">Menün, kategoriler ve malzemeleri tek panelden yönet.</p>
              </div>

              {/* Dashboard */}
              {activeView === 'dashboard' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-effect border border-red-900/30 rounded-2xl p-6">
                      <p className="text-gray-400 mb-2">Toplam Kategori</p>
                      <p className="text-4xl font-extrabold text-orange-400">{categories.length}</p>
                    </div>
                    <div className="glass-effect border border-red-900/30 rounded-2xl p-6">
                      <p className="text-gray-400 mb-2">Toplam Ürün</p>
                      <p className="text-4xl font-extrabold text-yellow-400">{allMenuItems.length}</p>
                    </div>
                    <div className="glass-effect border border-red-900/30 rounded-2xl p-6">
                      <p className="text-gray-400 mb-2">Toplam Malzeme</p>
                      <p className="text-4xl font-extrabold text-emerald-400">{ingredients.length}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => setShowCategoryForm(true)} className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-5 py-3 rounded-lg hover:from-red-500 hover:to-orange-500 transition-all duration-300 flex items-center gap-2 font-semibold">
                      <Plus className="h-5 w-5" /> Yeni Kategori
                    </button>
                    <button onClick={() => setShowMenuItemForm(true)} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 flex items-center gap-2 font-semibold">
                      <Plus className="h-5 w-5" /> Yeni Ürün
                    </button>
                    <button onClick={() => setShowIngredientForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2 font-semibold">
                      <Plus className="h-5 w-5" /> Yeni Malzeme
                    </button>
                  </div>
                </div>
              )}

              {/* Categories */}
              {activeView === 'categories' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <h2 className="text-2xl font-bold text-orange-400">Kategoriler</h2>
                    <div className="flex gap-3">
                      <button onClick={() => setShowCategoryForm(true)} className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-orange-500 flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Yeni Kategori
                      </button>
                    </div>
                  </div>

                  {categories.length === 0 ? (
                    <div className="glass-effect p-8 rounded-xl border border-red-900/30 text-center text-gray-300">Henüz kategori yok</div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categories.map((category) => (
                        <div key={category.id} className="glass-effect border border-red-900/30 rounded-xl p-5 hover:border-orange-500/40 transition-all">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-white">{category.nameTr}</h3>
                              {category.descriptionTr && <p className="text-sm text-gray-400 mt-1 line-clamp-2">{category.descriptionTr}</p>}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button onClick={() => editCategory(category)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg border border-blue-500/30">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => deleteCategory(category.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/30">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs text-gray-400">{category.menuItems.length} ürün</span>
                            <button onClick={() => { setActiveView('products'); setFilterCategoryId(category.id) }} className="text-sm text-orange-400 hover:text-orange-300">Ürünleri Gör</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Products */}
              {activeView === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <h2 className="text-2xl font-bold text-orange-400">Ürünler</h2>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Ürünlerde ara..."
                          className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-900/50 text-gray-100 placeholder-gray-500 border border-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <select
                        value={filterCategoryId}
                        onChange={(e) => setFilterCategoryId(e.target.value)}
                        className="sm:w-56 w-full rounded-lg bg-gray-900/50 text-gray-100 border border-red-900/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="">Tüm Kategoriler</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.nameTr}</option>
                        ))}
                      </select>
                      <button onClick={() => setShowMenuItemForm(true)} className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-orange-500 flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Yeni Ürün
                      </button>
                    </div>
                  </div>

                  {filteredMenuItems.length === 0 ? (
                    <div className="glass-effect p-8 rounded-xl border border-red-900/30 text-center text-gray-300">Sonuç bulunamadı</div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredMenuItems.map((item) => (
                        <div key={item.id} className="glass-effect border border-red-900/30 rounded-xl p-5 hover:border-orange-500/40 transition-all">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0">
                              <h3 className="text-lg font-bold text-orange-400 truncate">{item.nameTr}</h3>
                              <p className="text-sm text-gray-400 truncate">{categoryMap.get(item.categoryId)?.nameTr || '—'}</p>
                            </div>
                            <span className="text-yellow-400 font-bold ml-4">₺{item.price.toFixed(2)}</span>
                          </div>
                          {item.descriptionTr && <p className="text-sm text-gray-300 mt-2 line-clamp-2">{item.descriptionTr}</p>}
                          <div className="mt-4 flex justify-end gap-2">
                            <button onClick={() => editMenuItem(item)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg border border-blue-500/30">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => deleteMenuItem(item.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/30">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Ingredients */}
              {activeView === 'ingredients' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-orange-400">Malzemeler</h2>
                    <button onClick={() => setShowIngredientForm(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-500 hover:to-purple-500 flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Yeni Malzeme
                    </button>
                  </div>
                  {ingredients.length === 0 ? (
                    <div className="glass-effect p-8 rounded-xl border border-red-900/30 text-center text-gray-300">Henüz malzeme yok</div>
                  ) : (
                    <div className="glass-effect border border-red-900/30 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-12 px-4 py-3 text-sm text-gray-400 border-b border-red-900/30">
                        <div className="col-span-8">Ad</div>
                        <div className="col-span-4">Alerjen</div>
                      </div>
                      <div className="divide-y divide-red-900/30">
                        {ingredients.map((ing) => (
                          <div key={ing.id} className="grid grid-cols-12 px-4 py-3 text-sm">
                            <div className="col-span-8 text-gray-200">{ing.nameTr}</div>
                            <div className="col-span-4">{ing.allergen ? <span className="px-2 py-1 rounded bg-red-600/20 text-red-300 border border-red-600/30 text-xs">Alerjen</span> : <span className="px-2 py-1 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 text-xs">Güvenli</span>}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-effect border border-red-900/30 rounded-lg p-6 w-full max-w-md text-gray-100">
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
                className="text-gray-300 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitCategory)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  İngilizce İsim
                </label>
                <input
                  {...register('name', { required: true })}
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                  placeholder="Category Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Türkçe İsim
                </label>
                <input
                  {...register('nameTr', { required: true })}
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                  placeholder="Kategori Adı"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  İngilizce Açıklama
                </label>
                <textarea
                  {...register('description')}
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                  rows={3}
                  placeholder="Category Description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Türkçe Açıklama
                </label>
                <textarea
                  {...register('descriptionTr')}
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                  rows={3}
                  placeholder="Kategori Açıklaması"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Kategori Resmi
                </label>
                <input
                  type="file"
                  id="category-image"
                  accept="image/*"
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-red-600 file:text-white"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 rounded hover:from-red-500 hover:to-orange-500 flex items-center justify-center gap-2"
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
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-effect border border-red-900/30 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-100">
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
                className="text-gray-300 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitMenuItem)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    İngilizce İsim
                  </label>
                  <input
                    {...register('name', { required: true })}
                    className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                    placeholder="Product Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Türkçe İsim
                  </label>
                  <input
                    {...register('nameTr', { required: true })}
                    className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                    placeholder="Ürün Adı"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { required: true, min: 0 })}
                    className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Kategori
                  </label>
                  <select
                    {...register('categoryId', { required: true })}
                    className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100"
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
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  İngilizce Açıklama
                </label>
                <textarea
                  {...register('description')}
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                  rows={3}
                  placeholder="Product Description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Türkçe Açıklama
                </label>
                <textarea
                  {...register('descriptionTr')}
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                  rows={3}
                  placeholder="Ürün Açıklaması"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Özellikler
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      {...register('isVegetarian')}
                      className="mr-2"
                    />
                    Vejetaryen
                  </label>
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      {...register('isVegan')}
                      className="mr-2"
                    />
                    Vegan
                  </label>
                  <label className="flex items-center text-gray-300">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Malzemeler
                </label>
                <div className="max-h-32 overflow-y-auto border border-red-900/30 rounded p-2 bg-gray-900/40">
                  {ingredients.map((ingredient) => (
                    <label key={ingredient.id} className="flex items-center mb-1 text-gray-300">
                      <input
                        type="checkbox"
                        value={ingredient.id}
                        {...register('ingredients')}
                        className="mr-2"
                      />
                      {ingredient.nameTr} {ingredient.allergen && <span className="text-red-400">*</span>}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Ürün Resmi
                </label>
                <input
                  type="file"
                  id="menuitem-image"
                  accept="image/*"
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-red-600 file:text-white"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 rounded hover:from-red-500 hover:to-orange-500 flex items-center justify-center gap-2"
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
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-effect border border-red-900/30 rounded-lg p-6 w-full max-w-md text-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Yeni Malzeme</h2>
              <button
                onClick={() => {
                  setShowIngredientForm(false)
                  resetIngredient()
                }}
                className="text-gray-300 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleIngredientSubmit(onSubmitIngredient)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  İngilizce İsim
                </label>
                <input
                  {...registerIngredient('name', { required: true })}
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                  placeholder="Ingredient Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Türkçe İsim
                </label>
                <input
                  {...registerIngredient('nameTr', { required: true })}
                  className="w-full border border-red-900/30 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-900/50 text-gray-100 placeholder-gray-500"
                  placeholder="Malzeme Adı"
                />
              </div>
              
              <div>
                <label className="flex items-center text-gray-300">
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
                  className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 rounded hover:from-red-500 hover:to-orange-500 flex items-center justify-center gap-2"
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
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthGuard>
  )
}
