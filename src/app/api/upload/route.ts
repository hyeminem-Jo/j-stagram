import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'utils/supabase/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Signed URL 발급 전용 API
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

    if (!bucket) {
      return NextResponse.json(
        { error: 'Missing bucket name' },
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const body = await req.json();
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName & fileType required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 안전한 파일명 생성
    const safeNameBase = fileName.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image';
    const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const finalName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}_${safeNameBase}.${fileExt}`;

    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(finalName);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!data?.signedUrl || !data?.path) {
      return NextResponse.json(
        { error: 'Failed to create signed URL' },
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return NextResponse.json(
      { signedUrl: data.signedUrl, path: data.path },
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message ?? 'Unknown error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
