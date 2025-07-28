import { CheckCircle } from "lucide-react";

export function ArtpProgressBar() {
  return (
    <div className="flex items-center justify-between mb-2 text-sm px-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold mb-1">
          <CheckCircle className="h-5 w-5" />
        </div>
        <span className="text-teal-800 font-semibold">Registro</span>
      </div>
      <div className="flex-1 h-1 mx-2 bg-teal-700">
        <div className="w-full h-full bg-teal-700"></div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center mb-1">
          2
        </div>
        <span className="text-teal-800 font-semibold">Resultado ARTP</span>
      </div>
      <div className="flex-1 h-1 mx-2 bg-gray-200">
        <div className="w-0 h-full bg-teal-700"></div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center mb-1">
          3
        </div>
        <span className="text-gray-500">Envío</span>
      </div>
    </div>
  );
}
