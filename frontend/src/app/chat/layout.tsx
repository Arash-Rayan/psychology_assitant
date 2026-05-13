import { Header } from '@/components/Header';
import { ChatSubNav } from '@/components/ChatSubNav';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ChatSubNav />
      {children}
    </>
  );
}
