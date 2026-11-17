import { MockError } from '@/mocks/lib/mock.error';
import type { MockResult } from '@/mocks/lib/mock.result';
import { NextResponse } from 'next/server';
import { z, ZodError, type ZodTypeAny } from 'zod';

/* ============================================================================
 * ERROR → NextResponse — chuẩn { ok: false, data: null, message, code?, details? }
 * ========================================================================== */

export const toErrorResponse = (error: unknown): NextResponse => {
    // Lỗi nghiệp vụ có chủ đích
    if (error instanceof MockError) {
        return NextResponse.json(
            {
                ok: false,
                data: null,
                message: error.message,
                code: error.code,
                details: error.details,
            },
            { status: error.status },
        );
    }

    // Lỗi validate từ Zod
    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                ok: false,
                data: null,
                message: 'Dữ liệu không hợp lệ',
                code: 'VALIDATION_ERROR',
                details: error.flatten().fieldErrors,
            },
            { status: 400 },
        );
    }

    // Lỗi hệ thống — log để debug
    console.error('[MOCK ROUTE] Unexpected error:', error);
    return NextResponse.json(
        {
            ok: false,
            data: null,
            message: 'Đã có lỗi xảy ra',
            code: 'INTERNAL_ERROR',
        },
        { status: 500 },
    );
};

/* ============================================================================
 * MockResult → NextResponse — chuẩn { ok, data, message }
 * ========================================================================== */

export const toResponse = <T>(
    result: MockResult<T>,
    successStatus = 200,
): NextResponse => {
    if (!result.ok) return toErrorResponse(result.error);

    return NextResponse.json(
        {
            ok: true,
            data: result.data,
            message: result.message,
        },
        { status: successStatus },
    );
};

/**
 * Variant có phân trang — thêm `pagination` vào response.
 */
export const toPaginatedResponse = <T>(
    result: MockResult<T>,
    pagination: {
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
    },
    successStatus = 200,
): NextResponse => {
    if (!result.ok) return toErrorResponse(result.error);

    return NextResponse.json(
        {
            ok: true,
            data: result.data,
            message: result.message,
            pagination,
        },
        { status: successStatus },
    );
};

/* ============================================================================
 * PARSE HELPERS
 * ========================================================================== */

/**
 * Parse body bằng Zod schema.
 * @throws ZodError nếu không hợp lệ → toErrorResponse sẽ map sang 400.
 */
export const parseBody = async <S extends ZodTypeAny>(
    request: Request,
    schema: S,
): Promise<z.infer<S>> => {
    const body = await request.json().catch(() => ({}));
    return schema.parse(body);
};

/**
 * Parse query params bằng Zod schema.
 * @throws ZodError nếu không hợp lệ.
 */
export const parseQuery = <S extends ZodTypeAny>(
    request: Request,
    schema: S,
): z.infer<S> => {
    const url = new URL(request.url);
    return schema.parse(Object.fromEntries(url.searchParams));
};