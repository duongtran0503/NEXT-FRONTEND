import {
    parseBody,
    toErrorResponse,
} from '@/app/api/_lib/route.helpers';
import { ForgotPasswordRequestSchema } from '@/lib/schemas';
import * as authService from '@/mocks/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await parseBody(request, ForgotPasswordRequestSchema);

        await authService.forgotPassword(body.email);

        // Luôn trả success — tránh enumerate email
        return NextResponse.json({
            ok: true,
            data: { success: true },
            message: 'Nếu email tồn tại, hướng dẫn đã được gửi',
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}