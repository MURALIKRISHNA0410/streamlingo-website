"use client";


import { assets } from "@/utils/asset-utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { frameworks, type Framework } from "@/utils/framework-utils";
import { useState, useEffect } from "react";
import { cn } from "@/utils/tailwind-utils";
import animationData from "@/components/voiceAi.json";
import Lottie from "lottie-react";
//import { useMutation } from "convex/react";
//import { api } from "../../convex/_generated/api";
import { Instagram, LinkedinIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});


export default function Login(){


    const [docEnv, setDocEnv] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setDocEnv(true);
    }
  }, []);
  //const createWaitlist = useMutation(api.waitlists.createWaitlist);

  const [currentFramework, setCurrentFramework] = useState<Framework>(
    frameworks[0],
  );

  const [showBackground, setShowBackground] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const rotateFrameworks = () => {
      setCurrentFramework(frameworks[currentIndex]);
      currentIndex = (currentIndex + 1) % frameworks.length;
    };
    const intervalId = setInterval(rotateFrameworks, 2000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setShowBackground(true);
  }, []);
    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 no-scrollbar">
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
      {/* <div
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `url(${assets.square})`,
          backgroundSize: "30px",
        }}
      /> */}

      <div className="max-w-3xl mt-10 w-full">
        
        <div className="flex flex-col items-center mt-20 relative z-10">
          <h1
            className={`text-3xl sm:text-5xl md:text-7xl max-w-3xl text-white text-center leading-snug mb-6 sm:mb-8 md:mb-12 ${poppins.className}`}
          >
            Revolutionize Your Meetings with{" "}
            <span
              className={cn("transition-colors duration-200", {
                "text-purple-300": currentFramework === "qwik",
                "text-sky-300": currentFramework === "safari",
                "text-yellow-300": currentFramework === "chrome",
                "text-teal-300": currentFramework === "tailwind",
                "text-blue-300": currentFramework === "react",
                "text-green-300": currentFramework === "vue",
                "text-orange-400": currentFramework === "svelte",
                "text-red-300": currentFramework === "mobile",
                "text-neutral-300": currentFramework === "desktop",
              })}
            >
              StreamLingo
            </span>{" "}
          </h1>
          
          {/* <p className="text-gray-300 mb-4 sm:mb-6 md:mb-8 text-lg sm:text-xl md:text-2xl text-center">
            StreamLingo VoiceSync transforms your online meetings with advanced
            features like real-time language translations, interactive
            AI-powered tools, attendance tracking, and superior voice clarity.
            Join our waitlist to be the first to experience the future of
            business communication.
          </p> */}
          {/* <div className="h-full justify-center items-center w-full font-bold p-4 sm:p-8">
          <Lottie animationData={animationData}  style={{  }} />
        </div> */}
          <div className="mb-4 sm:mb-6 md:mb-8 w-full">
            <form
              id="waitlistForm"
              onSubmit={(e) => {
                //createWaitlist({ email });
                e.preventDefault();
              }}
              className="flex flex-col items-center w-full sm:flex-row sm:justify-center"
            >
                <div className="grid gap-6 mb-6 md:grid-cols-1">
              <input
                className={cn(
                  "text-gray-500 text-lg sm:text-xl md:text-2xl bg-gray-900 flex-1 py-2.5 outline-none border bg-opacity-20 shadow-md placeholder:text-neutral-500 pl-5 rounded-lg mb-4 sm:mb-0 sm:mr-2",
                  {
                    "border-purple-300": currentFramework === "qwik",
                    "border-sky-300": currentFramework === "safari",
                    "border-yellow-300": currentFramework === "chrome",
                    "border-teal-300": currentFramework === "tailwind",
                    "border-blue-300": currentFramework === "react",
                    "border-green-300": currentFramework === "vue",
                    "border-orange-400": currentFramework === "svelte",
                    "border-red-300": currentFramework === "mobile",
                    "border-neutral-300": currentFramework === "desktop",
                  },
                )}
                value={email}
                placeholder="Enter your Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                className={cn(
                  "text-gray-500 text-lg sm:text-xl md:text-2xl bg-gray-900 flex-1 py-2.5 outline-none border bg-opacity-20 shadow-md placeholder:text-neutral-500 pl-5 rounded-lg mb-4 sm:mb-0 sm:mr-2",
                  {
                    "border-purple-300": currentFramework === "qwik",
                    "border-sky-300": currentFramework === "safari",
                    "border-yellow-300": currentFramework === "chrome",
                    "border-teal-300": currentFramework === "tailwind",
                    "border-blue-300": currentFramework === "react",
                    "border-green-300": currentFramework === "vue",
                    "border-orange-400": currentFramework === "svelte",
                    "border-red-300": currentFramework === "mobile",
                    "border-neutral-300": currentFramework === "desktop",
                  },
                )}
                value={password}
                placeholder="Enter your Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="submit"
                    className={cn(
                      "text-black text-lg sm:text-xl md:text-2xl px-6 py-3 rounded-md font-semibold transition-colors duration-200",
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
                  >
                    Login
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-gray-300 max-w-lg mx-auto p-6 rounded-lg">
                  <DialogHeader>
                    <DialogTitle className="text-gray-300 mb-4 text-center font-bold text-2xl">
                      Thank you for Loggig in 
                    </DialogTitle>
                    <DialogDescription className="px-4 text-center text-lg">
                      Currently, The Home Page is under Maintainace.Sorry for the inconvineince caused Please Come back in the span of time to start the journey with Streamlingo.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              </div>
            </form>
          </div>
          {/* <div className="h-full justify-center items-center w-full font-bold p-4 sm:p-8">
          <Lottie animationData={animationData}  style={{  }} />
        </div> */}
          
          
        </div>
      </div>
    </main>
    )
}