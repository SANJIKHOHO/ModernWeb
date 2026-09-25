import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import './globals.css';

export const metadata = {
  title: 'E-Commerce',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <Header />
          <main className="container">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}