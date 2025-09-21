import { Metadata } from 'next';
import JStagramHome from '@/app/_modules/j-stagram/components/main/JStagramMain';

export const metadata: Metadata = {
  title: "Hyejin's Project | j-stagram",
  description: 'j-stagram 페이지 입니다.',
};

export default function JStagramPage() {
  return <JStagramHome />;
}
