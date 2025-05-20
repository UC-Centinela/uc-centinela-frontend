import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
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
        
        <p className="text-gray-600 mb-8">
          Plataforma para la gestión y análisis de riesgos en operaciones mineras
        </p>
        
        <Link href="/signin" className="block">
          <button className="w-full bg-[#2C5282] hover:bg-[#1e3a5f] text-white py-3 px-4 rounded-md transition-colors text-lg font-medium">
            Iniciar Sesión
          </button>
        </Link>
      </div>
    </main>
  );
}