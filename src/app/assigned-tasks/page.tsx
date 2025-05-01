"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AssignedTasks() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    return (
        <div className="flex flex-col items-center min-h-screen pt-8 px-4 bg-white">
            <div className="w-full max-w-md space-y-6 py-20">
                <div className="flex justify-center">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={200}
                    height={80}
                    className="mb-4"
                  />
                </div>
            </div>
        </div>
    )
}