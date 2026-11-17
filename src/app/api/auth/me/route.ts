import { toErrorResponse, toResponse } from '@/app/api/_lib/route.helpers';
import { getAccessToken } from '@/lib/helpers/auth/cookies';
import { MockError } from '@/mocks/lib/mock.error';
import * as authService from '@/mocks/services/auth.service';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const token = await getAccessToken();
        if (!token) throw MockError.unauthorized();

        const result = await authService.me(token);
        if (!result.ok) return toResponse(result);

        return NextResponse.json({
            ok: true,
            data: { account: result.data },
            message: result.message,
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}