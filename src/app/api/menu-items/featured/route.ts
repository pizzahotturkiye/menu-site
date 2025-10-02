import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const featuredMenuItems = await prisma.menuItem.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameTr: true
          }
        }
      },
      orderBy: { order: 'asc' },
      take: 3 // Only return 3 items
    })

    return NextResponse.json(featuredMenuItems)
  } catch (error) {
    console.error('Error fetching featured menu items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured menu items' },
      { status: 500 }
    )
  }
}