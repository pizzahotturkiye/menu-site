import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware-auth'

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { isActive: true },
      include: {
        category: true,
        ingredients: {
          include: {
            ingredient: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

export const POST = withAdminAuth(async (request: AuthenticatedRequest) => {
  try {
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
      isVegetarian, 
      isVegan, 
      isGlutenFree,
      ingredients 
    } = body

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        nameTr,
        description,
        descriptionTr,
        price: parseFloat(price),
        image,
        categoryId,
        order: order || 0,
        isVegetarian: isVegetarian || false,
        isVegan: isVegan || false,
        isGlutenFree: isGlutenFree || false,
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

    return NextResponse.json(menuItem, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
})
