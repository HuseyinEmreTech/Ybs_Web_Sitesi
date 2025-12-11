const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = 'huseyinemre.tech@gmail.com'
    const password = 'YbsAdmin@2024!'
    const name = 'Admin User'

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'admin',
            },
            create: {
                email,
                password: hashedPassword,
                name,
                role: 'admin',
            },
        })
        console.log(`Admin user created/updated: ${user.email}`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
