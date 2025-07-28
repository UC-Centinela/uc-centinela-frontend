"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  return (
    <div className="text-center max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <div className="mb-8 flex justify-center">
        <Image
          src="/logo.png"
          alt="Centinela Logo"
          width={200}
          height={80}
          priority
        />
      </div>

      <h1 className="text-2xl font-bold text-[#2C5282] mb-2">
        Asistente de Control de Riesgos Operacionales
      </h1>

      <p className="text-gray-600 mb-8 mt-4">
        Plataforma para la gestión y análisis de riesgos en operaciones mineras
      </p>

      <Link href="auth/login?returnTo=/" passHref>
        <Button className="w-full text-lg h-12">
          Iniciar Sesión
        </Button>
      </Link>
    </div>
  );
}
