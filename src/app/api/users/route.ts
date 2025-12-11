import { NextResponse } from 'next/server'
import { getUsers, createUser, updateUser, deleteUser, hashPassword, type User } from '@/lib/data'

export async function GET() {
    try {
        const users = await getUsers()
        // Don't return passwords
        const safeUsers = users.map(({ password, ...rest }) => rest)
        return NextResponse.json(safeUsers)
    } catch (error) {
        console.error('Get users error:', error)
        return NextResponse.json({ error: 'Kullanıcılar alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const users = await getUsers() // Needed to check email duplication

        // Check if email already exists
        if (users.find(u => u.email === body.email)) {
            return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı' }, { status: 400 })
        }

        // Hash the password before storing
        // createUser expects data (Omit id)
        const newUser = await createUser({
            email: body.email,
            password: hashPassword(body.password),
            name: body.name,
            role: body.role || 'editor',
            imageUrl: body.imageUrl,
        })

        const { password, ...safeUser } = newUser
        return NextResponse.json(safeUser, { status: 201 })
    } catch (error) {
        console.error('Create user error:', error)
        return NextResponse.json({ error: 'Kullanıcı oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { currentEmail, ...updates } = body

        if (!currentEmail) {
            return NextResponse.json({ error: 'Mevcut e-posta gerekli' }, { status: 400 })
        }

        const updatedUser = await updateUser(currentEmail, updates)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = updatedUser
        return NextResponse.json(safeUser)
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json({ error: 'Kullanıcı güncellenemedi' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')

        if (!email) {
            return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 })
        }

        const users = await getUsers()

        // Don't allow deleting the last admin
        const admins = users.filter(u => u.role === 'admin')
        const userToDelete = users.find(u => u.email === email)

        if (userToDelete?.role === 'admin' && admins.length <= 1) {
            return NextResponse.json({ error: 'Son admin silinemez' }, { status: 400 })
        }

        if (!userToDelete) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
        }

        await deleteUser(email)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json({ error: 'Kullanıcı silinemedi' }, { status: 500 })
    }
}
