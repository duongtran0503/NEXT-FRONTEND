import {
    parseBody,
    toErrorResponse,
    toResponse,
} from '@/app/api/_lib/route.helpers';
import { setAuthCookies } from '@/lib/helpers/auth/cookies';
import { LoginRequestSchema } from '@/lib/schemas';
import * as authService from '@/mocks/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await parseBody(request, LoginRequestSchema);
        const result = await authService.login(body);

        if (!result.ok) return toResponse(result);

        // Set httpOnly cookie từ tokens
        await setAuthCookies(result.data.tokens);

        // Response chuẩn — KHÔNG trả tokens (chỉ cookie giữ)
        return NextResponse.json(
            {
                ok: true,
                data: { account: result.data.account },
                message: result.message,
            },
            { status: 200 },
        );
    } catch (error) {
        return toErrorResponse(error);
    }
}