import type { Metadata } from 'next';
import '@apteva/apteva-kit/styles.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Apteva-Kit Examples',
  description: 'Example applications using Apteva-Kit components',
};

const themeScript = `
(function() {
  try {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-color-mode', 'dark');
    } else {
      document.documentElement.setAttribute('data-color-mode', 'light');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
