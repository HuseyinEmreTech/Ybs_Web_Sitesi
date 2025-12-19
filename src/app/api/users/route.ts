import { NextResponse } from 'next/server'
import { getUsers, createUser, updateUser, deleteUser, hashPassword, type User } from '@/lib/data'
import { requireAuth } from '@/lib/auth'
import { validateEmail, sanitizeString, validateLength } from '@/lib/validation'
import { logger } from '@/lib/logger'

export async function GET() {
    try {
        await requireAuth() // Require authentication
        const users = await getUsers()
        // Don't return passwords
        const safeUsers = users.map(({ password, ...rest }) => rest)
        return NextResponse.json(safeUsers)
    } catch (error) {
        logger.error('Get users error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Kullanıcılar alınamadı' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        await requireAuth() // Require authentication
        
        const body = await request.json()
        
        // Validation
        if (!body.email || !validateEmail(body.email)) {
            return NextResponse.json({ error: 'Geçersiz e-posta adresi' }, { status: 400 })
        }

        if (!body.password || !validateLength(body.password, 8, 100)) {
            return NextResponse.json({ error: 'Şifre 8-100 karakter arasında olmalıdır' }, { status: 400 })
        }

        if (!body.name || !validateLength(body.name, 1, 100)) {
            return NextResponse.json({ error: 'İsim 1-100 karakter arasında olmalıdır' }, { status: 400 })
        }

        const users = await getUsers() // Needed to check email duplication

        // Check if email already exists
        if (users.find(u => u.email === body.email.toLowerCase().trim())) {
            return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı' }, { status: 400 })
        }

        // Validate role
        const validRoles = ['admin', 'editor']
        const role = validRoles.includes(body.role) ? body.role : 'editor'

        // Sanitize and create user
        const newUser = await createUser({
            email: body.email.toLowerCase().trim(),
            password: hashPassword(body.password),
            name: sanitizeString(body.name, 100),
            role: role,
            imageUrl: body.imageUrl ? sanitizeString(body.imageUrl, 500) : null,
        })

        const { password, ...safeUser } = newUser
        return NextResponse.json(safeUser, { status: 201 })
    } catch (error) {
        logger.error('Create user error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Kullanıcı oluşturulamadı' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        await requireAuth() // Require authentication
        
        const body = await request.json()
        const { currentEmail, ...updates } = body

        if (!currentEmail) {
            return NextResponse.json({ error: 'Mevcut e-posta gerekli' }, { status: 400 })
        }

        // Validation and sanitization
        const updateData: Partial<User> = {}
        
        if (updates.email !== undefined) {
            if (!validateEmail(updates.email)) {
                return NextResponse.json({ error: 'Geçersiz e-posta adresi' }, { status: 400 })
            }
            updateData.email = updates.email.toLowerCase().trim()
        }
        
        if (updates.name !== undefined) {
            if (!validateLength(updates.name, 1, 100)) {
                return NextResponse.json({ error: 'İsim 1-100 karakter arasında olmalıdır' }, { status: 400 })
            }
            updateData.name = sanitizeString(updates.name, 100)
        }
        
        if (updates.password !== undefined) {
            if (!validateLength(updates.password, 8, 100)) {
                return NextResponse.json({ error: 'Şifre 8-100 karakter arasında olmalıdır' }, { status: 400 })
            }
            updateData.password = hashPassword(updates.password)
        }
        
        if (updates.role !== undefined) {
            const validRoles = ['admin', 'editor']
            updateData.role = validRoles.includes(updates.role) ? updates.role : 'editor'
        }
        
        if (updates.imageUrl !== undefined) {
            updateData.imageUrl = updates.imageUrl ? sanitizeString(updates.imageUrl, 500) : null
        }

        const updatedUser = await updateUser(currentEmail, updateData)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = updatedUser
        return NextResponse.json(safeUser)
    } catch (error) {
        logger.error('Update user error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Kullanıcı güncellenemedi' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        await requireAuth() // Require authentication
        
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')

        if (!email) {
            return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 })
        }

        if (!validateEmail(email)) {
            return NextResponse.json({ error: 'Geçersiz e-posta adresi' }, { status: 400 })
        }

        const users = await getUsers()

        // Don't allow deleting the last admin
        const admins = users.filter(u => u.role === 'admin')
        const userToDelete = users.find(u => u.email === email.toLowerCase().trim())

        if (userToDelete?.role === 'admin' && admins.length <= 1) {
            return NextResponse.json({ error: 'Son admin silinemez' }, { status: 400 })
        }

        if (!userToDelete) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
        }

        await deleteUser(email.toLowerCase().trim())
        return NextResponse.json({ success: true })
    } catch (error) {
        logger.error('Delete user error', { error })
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return NextResponse.json({ error: 'Kullanıcı silinemedi' }, { status: 500 })
    }
}
