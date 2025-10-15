const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    })

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email)
      return
    }

    // Create initial admin user
    const hashedPassword = await bcrypt.hash('Pizzahott44', 12)
    
    const admin = await prisma.user.create({
      data: {
        email: 'pizzahotturkiye@gmail.com',
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin'
      }
    })

    console.log('Admin user created successfully:')
    console.log('Email:', admin.email)
    console.log('Password: admin123 (CHANGE THIS IN PRODUCTION!)')
    console.log('User ID:', admin.id)

  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

