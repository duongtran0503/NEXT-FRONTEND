import {
    parseBody,
    toErrorResponse,
    toResponse,
} from '@/app/api/_lib/route.helpers';
import { clearAuthCookies, getAccessToken } from '@/lib/helpers/auth/cookies';
import { ChangePasswordRequestSchema } from '@/lib/schemas';
import { MockError } from '@/mocks/lib/mock.error';
import * as authService from '@/mocks/services/auth.service';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const token = await getAccessToken();
        if (!token) throw MockError.unauthorized();

        const me = await authService.me(token);
        if (!me.ok) return toResponse(me);

        const body = await parseBody(request, ChangePasswordRequestSchema);
        const result = await authService.changePassword(
            me.data.id,
            body.currentPassword,
            body.newPassword,
        );

        if (!result.ok) return toResponse(result);

        // Đổi mật khẩu → invalidate session → clear cookie
        await clearAuthCookies();

        return NextResponse.json({
            ok: true,
            data: result.data,
            message: result.message,
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}