import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdminAuth, AuthenticatedRequest } from '@/lib/middleware-auth'

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(ingredients)
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 }
    )
  }
}

export const POST = withAdminAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json()
    const { name, nameTr, allergen } = body

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        nameTr,
        allergen: allergen || false
      }
    })

    return NextResponse.json(ingredient, { status: 201 })
  } catch (error) {
    console.error('Error creating ingredient:', error)
    return NextResponse.json(
      { error: 'Failed to create ingredient' },
      { status: 500 }
    )
  }
})
