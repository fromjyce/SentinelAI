import "../app/globals.css";
import {Poppins, Play, Space_Grotesk, Urbanist} from "next/font/google";
import { GeistSans } from 'geist/font/sans';

const poppins_init = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
  });
  
  const play_init = Play({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-play",
  });
  
  const space_grotesk_init = Space_Grotesk({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-space_grotesk",
  });
  
  const urbanist_init = Urbanist({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-urbanist",
  });
  
  export const metadata = {
    title: "SentinelAI",
    description: "Autonomous Cybersecurity for Real-Time IoT Node Protection",
  };

function MyApp({ Component, pageProps }) {
    return (
        <div className={`${urbanist_init.variable} ${space_grotesk_init.variable} ${play_init.variable} ${poppins_init.variable} ${poppins_init.variable} ${GeistSans.variable} antialiased`}>
          <main>
            <Component {...pageProps} />
          </main>
        </div>
      );
}

export default MyApp;