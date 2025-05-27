import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg gap-6">
        <ShieldAlert className="text-red-500" size={64} />
        <h2 className="text-2xl font-bold text-gray-800">Acceso denegado</h2>
        <p className="text-gray-600 text-center max-w-md">
          Lo sentimos, no tienes permisos para acceder a esta página.
          <br />
          Si crees que esto es un error, contacta al administrador.
        </p>
        <Link href="/" passHref>
          <Button className="mt-4">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </main>
  );
}
