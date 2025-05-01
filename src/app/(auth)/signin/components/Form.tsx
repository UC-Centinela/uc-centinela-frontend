"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // TODO: Implementar sign in con Auth0
    } catch (error) {
      setLoading(false);
      console.error("An unexpected error happened:", error);
      alert("An unexpected error happened");
    }
  };

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

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-normal text-[#2C5282]">
            Te damos la bienvenida a tu
          </h1>
          <h2 className="text-2xl font-bold text-[#2C5282]">
            Asistente de Control de
            <br />
            Riesgos Operacionales
          </h2>
        </div>

        <form action={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-[#2C5282] font-medium mb-2">
                Usuario
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Ingresa tu usuario o email"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2C5282]"
              />
            </div>

            <div>
              <label className="block text-[#2C5282] font-medium mb-2">
                Contraseña
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#2C5282]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md transition-colors"
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </Button>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-[#2C5282] hover:underline text-sm"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
