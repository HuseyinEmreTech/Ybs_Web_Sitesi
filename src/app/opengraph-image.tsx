import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'İste YBS Topluluğu'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #020617, #1e293b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: '#6366f1',
                        marginBottom: '40px',
                        fontSize: '60px',
                    }}
                >
                    🚀
                </div>
                <div
                    style={{
                        fontSize: '72px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '20px',
                    }}
                >
                    İste YBS Topluluğu
                </div>
                <div
                    style={{
                        fontSize: '32px',
                        color: '#94a3b8',
                        maxWidth: '800px',
                        textAlign: 'center',
                    }}
                >
                    Geleceğin YBS liderlerini bir araya getiriyoruz.
                </div>
                <div
                    style={{
                        marginTop: '60px',
                        padding: '12px 24px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '100px',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        fontSize: '24px',
                        color: '#6366f1',
                    }}
                >
                    iste-ybs.com
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
