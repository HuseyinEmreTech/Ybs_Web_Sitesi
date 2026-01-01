import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/data'

export const runtime = 'edge'

export const alt = 'Ybs Topluluğu Blog'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #020617, #1e293b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: '80px',
                    color: 'white',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#6366f1',
                            marginRight: '15px',
                        }}
                    />
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>İste YBS Topluluğu</span>
                </div>
                <div
                    style={{
                        fontSize: '60px',
                        fontWeight: 'bold',
                        lineHeight: 1.1,
                        marginBottom: '30px',
                    }}
                >
                    {post?.title || 'YBS Blog'}
                </div>
                <div
                    style={{
                        fontSize: '28px',
                        color: '#94a3b8',
                        maxWidth: '800px',
                        lineHeight: 1.4,
                    }}
                >
                    {post?.excerpt || ''}
                </div>
                <div
                    style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '20px',
                        color: '#6366f1',
                    }}
                >
                    <span>iste-ybs.com</span>
                    <span style={{ margin: '0 15px', color: '#334155' }}>|</span>
                    <span style={{ color: '#94a3b8' }}>{post?.category || 'Genel'}</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
