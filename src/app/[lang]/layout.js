import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import Script from "next/script";
import "../globals.css";
import { getDictionary } from "@/dictionaries";
import { I18nProvider } from "@/lib/i18n-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return {
    title: lang === 'en' ? "Fabián Henry | Software Engineer" : "Fabián Henry | Ingeniero Civil en Informática",
    description: lang === 'en' ? "Fabián Henry's Portfolio. Specialized in Backend, Cloud Architecture and DevOps." : "Portafolio de Fabián Henry. Especializado en Backend, Arquitectura Cloud y DevOps.",
    icons: {
      icon: "/favicon.svg",
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-text-primary bg-bg-primary selection:bg-accent/30 selection:text-accent">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <I18nProvider dictionary={dict} locale={lang}>
            <Navbar />
            {children}
            <Footer />
            <ScrollToTop />
          </I18nProvider>
        </ThemeProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
