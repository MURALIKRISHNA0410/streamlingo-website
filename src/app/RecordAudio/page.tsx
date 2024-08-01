"use client";
import React from 'react';
import { assets } from "@/utils/asset-utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { frameworks, type Framework } from "@/utils/framework-utils";
import { useState, useEffect } from "react";
import { cn } from "@/utils/tailwind-utils";
import Link from 'next/link';

const poppins = Poppins({
    weight: "700",
    subsets: ["latin"],
  });

 

 
export default function page() {

    

      const [currentFramework, setCurrentFramework] = useState<Framework>(
        frameworks[0],
      );
    
      useEffect(() => {
        //console.log("record audio page");
        let currentIndex = 0;
        const rotateFrameworks = () => {
          setCurrentFramework(frameworks[currentIndex]);
          currentIndex = (currentIndex + 1) % frameworks.length;
        };
        const intervalId = setInterval(rotateFrameworks, 2000);
        return () => clearInterval(intervalId);
      }, []);
  return (
    <>
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
     

      <div className="mt-10 w-full">
        
        <div className="flex flex-col items-center mt-20 relative z-10">
            <Link href="/Recordings">
          <button
            className={`hover:bg-blue-950 hover: rounded-full text-xl sm:text-5xl md:text-7xl max-w-3xl text-white text-center leading-snug mb-6 sm:mb-8 md:mb-12 ${poppins.className}`}
          >Record Your Audio
          </button>
          </Link>
          </div>
          </div>
          </>
  )
}
