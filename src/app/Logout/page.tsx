"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { assets } from "@/utils/asset-utils";
import { cn } from "@/utils/tailwind-utils";
import { frameworks, type Framework } from "@/utils/framework-utils";
import { Poppins } from "next/font/google";
import { getCookie, deleteCookie } from 'cookies-next';
const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});
export default function page() {

    const [currentFramework, setCurrentFramework] = useState<Framework>(
        frameworks[0],
      );
      const Logout = () => {
        useEffect(() => {
          if (typeof document !== "undefined") {
            const allCookies = document.cookie.split(";");
      
            allCookies.forEach((cookie) => {
              const cookieName = cookie.split("=")[0].trim();
              if (cookieName) {
                deleteCookie(cookieName, { path: '/' });
              }
            });
      
           
          }
        }, []);
      }
      
      

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 no-scrollbar bg-white">
      <div
        className={cn(
          "fixed inset-0 transition-colors delay-100 duration-700 opacity-100",
          {
            "bg-purple-300": currentFramework === "qwik",
            "bg-sky-300": currentFramework === "safari",
            "bg-yellow-300": currentFramework === "chrome",
            "bg-teal-300": currentFramework === "tailwind",
            "bg-blue-300": currentFramework === "react",
            "bg-green-300": currentFramework === "vue",
            "bg-orange-400": currentFramework === "svelte",
            "bg-red-300": currentFramework === "mobile",
            "bg-neutral-300": currentFramework === "desktop",
          },
        )}
      />
      <Image
        width={1200}
        height={1200}
        role="presentation"
        alt="gradient background"
        className="fixed inset-0 w-screen h-screen object-cover"
        src={assets.gradient}
      />
    

      <div className="max-w-3xl w-full">
        
        <div className={`flex flex-col items-center relative z-10 ${poppins.className}` }>
          <h1
            className={`text-xl sm:text-xl md:text-xl max-w-3xl text-white text-center leading-snug mb-6 sm:mb-8 md:mb-12 ${poppins.className}`}
          >You Have been LoggedOut Succesfully It is Safe to to close the browser
           
          </h1>
      
    <h1 className='py-40'></h1>
    </div>
    </div>
    </div>
  )
}
