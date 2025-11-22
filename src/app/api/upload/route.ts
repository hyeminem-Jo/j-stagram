import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'utils/supabase/server';

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

    // 파일 유효성 검사
    for (const file of files) {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 5MB`, code: 'FILE_TOO_LARGE' },
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
          const fileExt = file.name.split('.').pop() || '';
          // 파일명에서 특수문자 제거
          const safeBaseName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-zA-Z0-9-_]/g, '_')
            .substring(0, 50); // 파일명 길이 제한
          const uniqueFileName = `${safeBaseName}_${timestamp}_${randomStr}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(uniqueFileName, file, {
              cacheControl: '3600',
              upsert: false, // 중복 방지
            });

          if (error) {
            console.error('Supabase upload error:', error);
            throw new Error(`Upload failed for ${file.name}: ${error.message}`);
          }

          return { data };
        } catch (fileError) {
          console.error('File upload error:', fileError);
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
    console.error('Upload API error:', error);
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
