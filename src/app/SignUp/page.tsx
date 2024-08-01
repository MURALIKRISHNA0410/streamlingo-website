"use client";

import { assets } from "@/utils/asset-utils";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { frameworks, type Framework } from "@/utils/framework-utils";
import { useState, useEffect } from "react";
import { cn } from "@/utils/tailwind-utils";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});

export default function SignUp() {
  const router = useRouter();
  const [docEnv, setDocEnv] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setDocEnv(true);
    }
  }, []);

  const [currentFramework, setCurrentFramework] = useState<Framework>(frameworks[0]);
  const [showBackground, setShowBackground] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const newErrors: { [key: string]: string } = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!cpassword) newErrors.cpassword = "Confirmation password is required";
    if (password !== cpassword) newErrors.cpassword = "Passwords do not match";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCookie("email", email, { maxAge: 60 * 60 * 24 });
      setCookie("firstname", firstName, { maxAge: 60 * 60 * 24 });
      setCookie("lastName", lastName, { maxAge: 60 * 60 * 24 });
      setCookie("phnumber", phoneNumber, { maxAge: 60 * 60 * 24 });
      router.push("/RecordAudio");
      console.log("signed Up Successfully");
    }
  };

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
        <div className={`flex flex-col items-center relative z-10 ${poppins.className}`}>
          <h1
            className={`text-xl sm:text-5xl md:text-7xl max-w-3xl text-white text-center leading-snug mb-6 sm:mb-8 md:mb-12 ${poppins.className}`}
          >
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

          <div className="mb-4 sm:mb-6 md:mb-8 w-full">
            <form
              id="SignUpForm"
              onSubmit={handleSubmit}
              className="flex flex-col items-center w-full sm:flex-row sm:justify-center"
            >
              <div className="grid gap-6 mb-6 md:grid-cols-1">
                <input
                  className={cn(
                    "text-gray-500 text-lg sm:text-xl md:text-2xl bg-gray-900 flex-1 py-2.5 outline-none border bg-opacity-20 shadow-md placeholder:text-neutral-500 pl-5 rounded-lg mb-4 sm:mb-0 sm:mr-2",
                    errors.firstName ? "border-red-500" : {
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
                  type="text"
                  value={firstName}
                  placeholder="Enter your First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
                <input
                  className={cn(
                    "text-gray-500 text-lg mt-4 sm:text-xl md:text-2xl bg-gray-900 flex-1 py-2.5 outline-none border bg-opacity-20 shadow-md placeholder:text-neutral-500 pl-5 rounded-lg mb-4 sm:mb-0 sm:mr-2",
                    errors.lastName ? "border-red-500" : {
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
                  type="text"
                  value={lastName}
                  placeholder="Enter your Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
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
                  required
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
                  required
                />
                {errors.password && <p className="text-red-500">{errors.password}</p>}
                <input
                  className={cn(
                    "text-gray-500 text-lg sm:text-xl md:text-2xl bg-gray-900 flex-1 py-2.5 outline-none border bg-opacity-20 shadow-md placeholder:text-neutral-500 pl-5 rounded-lg mb-4 sm:mb-0 sm:mr-2",
                    errors.cpassword ? "border-red-500" : {
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
                  value={cpassword}
                  placeholder="Re-enter Password"
                  onChange={(e) => setCPassword(e.target.value)}
                  required
                />
                {errors.cpassword && <p className="text-red-500">{errors.cpassword}</p>}
                <input
                  className={cn(
                    "text-gray-500 text-lg sm:text-xl md:text-2xl bg-gray-900 flex-1 py-2.5 outline-none border bg-opacity-20 shadow-md placeholder:text-neutral-500 pl-5 rounded-lg mb-4 sm:mb-0 sm:mr-2",
                    errors.phoneNumber ? "border-red-500" : {
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
                  type="text"
                  value={phoneNumber}
                  placeholder="Enter your phone number"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}

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
                  SignUp
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
