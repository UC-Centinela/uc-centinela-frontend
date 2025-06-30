import { ReactNode } from "react";

interface ArtpItemSectionProps {
  title: string;
  items: any[];
  criticActivityId: string;
  adding: { [criticActivityId: string]: boolean };
  editing: { [itemId: string]: boolean };
  onAdd: (criticActivityId: string) => void;
  onSetAdding: (criticActivityId: string, value: boolean) => void;
  children: ReactNode;
}

export function ArtpItemSection({
  title,
  items,
  criticActivityId,
  adding,
  editing,
  onAdd,
  onSetAdding,
  children,
}: ArtpItemSectionProps) {
  return (
    <details className="mb-2" open>
      <summary className="cursor-pointer font-medium text-teal-700">
        {title}
      </summary>
      <div className="pl-4 mt-2 space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-400">No hay {title.toLowerCase()}.</p>
        ) : (
          children
        )}
        {adding[criticActivityId] ? (
          <div className="flex flex-col space-y-2 mt-2">
            <input
              className="border rounded p-1 text-sm flex-1"
              placeholder="Título"
            />
            <textarea
              className="border rounded p-1 text-sm flex-1"
              placeholder="Descripción"
            />
            <div className="flex space-x-2">
              <button
                className="bg-teal-700 text-white rounded px-2 py-1 text-xs"
                onClick={() => onAdd(criticActivityId)}
              >
                Guardar
              </button>
              <button
                className="text-gray-500 text-xs"
                onClick={() => onSetAdding(criticActivityId, false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            className="mt-2 text-teal-700 text-xs"
            onClick={() => onSetAdding(criticActivityId, true)}
          >
            Añadir {title.toLowerCase().slice(0, -1)}
          </button>
        )}
      </div>
    </details>
  );
}
