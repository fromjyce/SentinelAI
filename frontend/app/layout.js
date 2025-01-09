import {Poppins, Play, Space_Grotesk, Urbanist} from "next/font/google";
import "./globals.css";

const poppins_init = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-afacad",
});

const play_init = Play({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-afacad",
});

const space_grotesk_init = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-afacad",
});

const urbanist_init = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-afacad",
});

export const metadata = {
  title: "SentinelAI",
  description: "Autonomous Cybersecurity for Real-Time IoT Node Protection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${urbanist_init.variable} ${space_grotesk_init.variable} ${play_init.variable} ${poppins_init.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
