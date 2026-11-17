import { toErrorResponse, toResponse } from '@/app/api/_lib/route.helpers';
import {
    clearAuthCookies,
    getRefreshToken,
    setAuthCookies,
} from '@/lib/helpers/auth/cookies';
import { MockError } from '@/mocks/lib/mock.error';
import * as authService from '@/mocks/services/auth.service';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            throw MockError.unauthorized('Không có refresh token');
        }

        const result = await authService.refresh(refreshToken);
        if (!result.ok) {
            // Refresh fail → clear cookie để buộc login lại
            await clearAuthCookies();
            return toResponse(result);
        }

        // Rotate cookie với tokens mới
        await setAuthCookies(result.data);

        return NextResponse.json({
            ok: true,
            data: { success: true },
            message: result.message,
        });
    } catch (error) {
        await clearAuthCookies();
        return toErrorResponse(error);
    }
}