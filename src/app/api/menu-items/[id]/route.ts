import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    })

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error('Error fetching menu item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    )
  }
}

export const PUT = withAdminAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const body = await request.json()
    const { 
      name, 
      nameTr, 
      description, 
      descriptionTr, 
      price, 
      image, 
      categoryId, 
      order, 
      isActive, 
      isVegetarian, 
      isVegan, 
      isGlutenFree,
      ingredients 
    } = body

    // First, delete existing ingredient relationships
    await prisma.menuItemIngredient.deleteMany({
      where: { menuItemId: id }
    })

    // Then update the menu item and create new ingredient relationships
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        nameTr,
        description,
        descriptionTr,
        price: parseFloat(price),
        image,
        categoryId,
        order,
        isActive,
        isVegetarian,
        isVegan,
        isGlutenFree,
        ingredients: {
          create: ingredients?.map((ingredientId: string) => ({
            ingredientId
          })) || []
        }
      },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    })

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
})

export const DELETE = withAdminAuth(async (
  request: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    await prisma.menuItem.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Menu item deleted successfully' })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
})
