import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookiesIn = await cookies();
        const access_token = cookiesIn.get('access_token')?.value;
        const refresh_token = cookiesIn.get('refresh_token')?.value;

        if (!access_token || !refresh_token) {
            return NextResponse.json(
                { error: 'Tokens not found' },
                { status: 404 }
            );
        }
        console.log('Fetched tokens:', { access_token, refresh_token });

        return NextResponse.json({ access_token, refresh_token });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
export async function POST(req: Request) {
    try {
        const { access_token, refresh_token } = await req.json();

        if (!access_token || !refresh_token) {
            return NextResponse.json(
                { error: 'Missing tokens' },
                { status: 400 }
            );
        }

        const cookiesIn = await cookies();
        cookiesIn.set('access_token', access_token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
        });

        cookiesIn.set('refresh_token', refresh_token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            path: '/',
        });

        return NextResponse.json({ message: 'Tokens stored successfully' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const cookiesIn = await cookies();
        cookiesIn.delete('access_token');
        cookiesIn.delete('refresh_token');

        return NextResponse.json({ message: 'Cookies cleared' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to clear cookies' },
            { status: 500 }
        );
    }
}
