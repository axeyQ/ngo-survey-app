import './globals.css';

export const metadata = {
  title: 'NGO Survey Portal',
  description: 'NGO survey collection platform with Google OAuth',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  );
}