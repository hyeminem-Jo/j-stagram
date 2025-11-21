import { atom } from 'jotai';
import { MyInfo } from '@/app/types/commonType';

export const myInfoState = atom<MyInfo>({
  id: '',
  email: '',
  phone: '',
  created_at: '',
  last_sign_in_at: '',
  user_metadata: {
    avatar_url: '',
    preferred_username: '',
    name: '',
    user_name: '',
  },
});

export const selectedChatUserIdState = atom<string>('');

export const movieSearchState = atom<string>('');

export const postSearchState = atom<string>('');

export const presenceState = atom<Record<string, unknown>>({});
