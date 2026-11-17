import {
    parseBody,
    toErrorResponse,
    toResponse,
} from '@/app/api/_lib/route.helpers';
import { ResetPasswordRequestSchema } from '@/lib/schemas';
import * as authService from '@/mocks/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await parseBody(request, ResetPasswordRequestSchema);

        const result = await authService.resetPassword(
            body.token,
            body.newPassword,
        );

        if (!result.ok) return toResponse(result);

        return NextResponse.json({
            ok: true,
            data: result.data,
            message: result.message,
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}