import { toErrorResponse } from '@/app/api/_lib/route.helpers';
import {
    clearAuthCookies,
    getAccessToken,
    getRefreshToken,
} from '@/lib/helpers/auth/cookies';
import * as authService from '@/mocks/services/auth.service';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const [accessToken, refreshToken] = await Promise.all([
            getAccessToken(),
            getRefreshToken(),
        ]);

        // Xóa session trong mock store
        await authService.logout(accessToken, refreshToken);

        // Xóa cookie
        await clearAuthCookies();

        return NextResponse.json({
            ok: true,
            data: { success: true },
            message: 'Đăng xuất thành công',
        });
    } catch (error) {
        return toErrorResponse(error);
    }
}