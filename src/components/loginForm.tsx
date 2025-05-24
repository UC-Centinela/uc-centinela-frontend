"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5282]"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    );
  }

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
        <button className="w-full bg-[#2C5282] hover:bg-[#1e3a5f] text-white py-3 px-4 rounded-md transition-colors text-lg font-medium">
          Iniciar Sesión
        </button>
      </Link>
    </div>
  );
}
