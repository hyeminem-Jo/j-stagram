import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'utils/supabase/server';

// API Route 설정: 요청 크기 제한 및 타임아웃 설정
export const runtime = 'nodejs';
export const maxDuration = 60; // 60초 타임아웃

export async function POST(req: NextRequest) {
  try {
    // 환경변수 검증
    const bucketName = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
    if (!bucketName) {
      return NextResponse.json(
        { error: 'Storage bucket not configured', code: 'MISSING_BUCKET' },
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const formData = await req.formData();
    const files = Array.from(formData.entries())
      .map(([, file]) => file as File)
      .filter((file) => file instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided', code: 'NO_FILES' },
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const MAX_TOTAL_SIZE = 4 * 1024 * 1024; // 총 파일 크기 4MB 제한
    const MAX_SINGLE_FILE_SIZE = 10 * 1024 * 1024; // 개별 파일 10MB 제한

    // 총 파일 크기 계산
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    // 총 파일 크기 검사 (4MB)
    if (totalSize > MAX_TOTAL_SIZE) {
      const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
      return NextResponse.json(
        {
          error: `선택한 모든 파일의 총 크기가 4MB를 초과합니다. (현재: ${totalSizeMB}MB)`,
          code: 'TOTAL_SIZE_TOO_LARGE',
        },
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 파일 유효성 검사
    for (const file of files) {
      // 개별 파일 크기 제한 (10MB)
      if (file.size > MAX_SINGLE_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 10MB`, code: 'FILE_TOO_LARGE' },
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }

      // 파일 타입 검사
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `File ${file.name} is not an image`, code: 'INVALID_FILE_TYPE' },
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }

    const supabase = await createServerSupabaseClient();

    // Supabase 클라이언트 검증
    if (!supabase) {
      return NextResponse.json(
        { error: 'Failed to initialize Supabase client', code: 'SUPABASE_INIT_ERROR' },
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const result = await Promise.all(
      files.map(async (file) => {
        try {
          // 고유한 파일명 생성 (타임스탬프 + 랜덤 문자열)
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';

          // 파일명에서 특수문자 제거 및 안전한 파일명 생성
          let safeBaseName = file.name
            .replace(/\.[^/.]+$/, '') // 확장자 제거
            .replace(/[^a-zA-Z0-9-_]/g, '_') // 특수문자를 언더스코어로 변경
            .substring(0, 50); // 파일명 길이 제한

          // 파일명이 빈 문자열이거나 숫자로만 되어있는 경우 처리
          if (!safeBaseName || /^\d+$/.test(safeBaseName)) {
            safeBaseName = `image_${timestamp}`;
          }

          const uniqueFileName = `${safeBaseName}_${timestamp}_${randomStr}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(uniqueFileName, file, {
              cacheControl: '3600',
              upsert: false, // 중복 방지
            });

          if (error) {
            throw new Error(`Upload failed for ${file.name}: ${error.message}`);
          }

          return { data };
        } catch (fileError) {
          throw fileError;
        }
      }),
    );

    return NextResponse.json(
      { result },
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
