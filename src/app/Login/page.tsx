"use client";

import { assets } from "@/utils/asset-utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { frameworks, type Framework } from "@/utils/framework-utils";
import { useState, useEffect } from "react";
import { cn } from "@/utils/tailwind-utils";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { useRouter } from 'next/navigation';
const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});

export default function Login() {
  const router=useRouter();
  const [docEnv, setDocEnv] = useState(false);
  const [currentFramework, setCurrentFramework] = useState<Framework>(frameworks[0]);
  const [showBackground, setShowBackground] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (typeof document !== "undefined") {
      setDocEnv(true);
    }
  }, []);

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

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCookie("email", email, { maxAge: 60 * 60 * 24 });
      console.log("login form is submitted");
      router.push('/Home');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center md:p-8 no-scrollbar">
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
          }
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
        <div className="flex flex-col items-center relative z-10">
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
            </span>
          </h1>

          <div className="mb-4 sm:mb-6 md:mb-8 w-full">
            <form
              id="loginForm"
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full sm:flex-row sm:justify-center"
            >
              <div className="grid gap-6 mb-6 md:grid-cols-1 w-full">
                <input
                  className={cn(
                    "text-gray-500 text-lg sm:text-xl md:text-2xl bg-gray-900 flex-1 py-2.5 outline-none border bg-opacity-20 shadow-md placeholder:text-neutral-500 pl-5 rounded-lg mb-4 sm:mb-0 sm:mr-2",
                    errors.email ? "border-red-500" : {
                      "border-purple-300": currentFramework === "qwik",
                      "border-sky-300": currentFramework === "safari",
                      "border-yellow-300": currentFramework === "chrome",
                      "border-teal-300": currentFramework === "tailwind",
                      "border-blue-300": currentFramework === "react",
                      "border-green-300": currentFramework === "vue",
                      "border-orange-400": currentFramework === "svelte",
                      "border-red-300": currentFramework === "mobile",
                      "border-neutral-300": currentFramework === "desktop",
                    }
                  )}
                  type="email"
                  value={email}
                  placeholder="Enter your Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
                <input
                  className={cn(
                    "text-gray-500 text-lg sm:text-xl md:text-2xl bg-gray-900 flex-1 py-2.5 outline-none border bg-opacity-20 shadow-md placeholder:text-neutral-500 pl-5 rounded-lg mb-4 sm:mb-0 sm:mr-2",
                    errors.password ? "border-red-500" : {
                      "border-purple-300": currentFramework === "qwik",
                      "border-sky-300": currentFramework === "safari",
                      "border-yellow-300": currentFramework === "chrome",
                      "border-teal-300": currentFramework === "tailwind",
                      "border-blue-300": currentFramework === "react",
                      "border-green-300": currentFramework === "vue",
                      "border-orange-400": currentFramework === "svelte",
                      "border-red-300": currentFramework === "mobile",
                      "border-neutral-300": currentFramework === "desktop",
                    }
                  )}
                  type="password"
                  value={password}
                  placeholder="Enter your Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500">{errors.password}</p>}
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
                    }
                  )}
                >
                  Login
                </button>
                <div className="grid md:grid-cols-2 text-blue-600 space-x-4">
                  <p>Didn't have an account?</p>
                  <Link href="/SignUp"><p>SignUp</p></Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
