// 파일명이 영문, 숫자, -, _ 로만 이루어져 있다면 원본 파일명 유지, 아닐 경우 변환 후 타임스탬프 추가
export const toSafeFileName = (name: string) => {
  const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
  const base = name.replace(/\.[^/.]+$/, '');
  // 파일명이 이미 안전한 형식인지 체크
  if (/^[a-zA-Z0-9-_]+$/.test(base)) {
    return name;
  }
  const safeBase = base.replace(/[^a-zA-Z0-9-_]/g, '_');
  const timestamp = Date.now();
  return `${safeBase}_${timestamp}${ext}`;
};

