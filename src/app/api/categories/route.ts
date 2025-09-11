import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware-auth'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        menuItems: {
          where: { isActive: true },
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export const POST = withAdminAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const { name, nameTr, description, descriptionTr, image, order } = body

    const category = await prisma.category.create({
      data: {
        name,
        nameTr,
        description,
        descriptionTr,
        image,
        order: order || 0
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
})
