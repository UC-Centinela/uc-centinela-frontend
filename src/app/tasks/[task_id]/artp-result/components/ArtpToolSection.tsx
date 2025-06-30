import { ArtpTool } from "@/services/artp";

interface ArtpToolSectionProps {
  tools: ArtpTool[];
  criticActivityId: string;
  addingTool: { [criticActivityId: string]: boolean };
  newToolTitle: { [criticActivityId: string]: string };
  editingTool: { [toolId: string]: boolean };
  editToolTitle: { [toolId: string]: string };
  onAddTool: (criticActivityId: string) => void;
  onUpdateTool: (
    toolId: string,
    criticActivityId: string,
    newTitle: string
  ) => void;
  onDeleteTool: (toolId: string, toolName: string) => void;
  onSetAddingTool: (criticActivityId: string, value: boolean) => void;
  onSetNewToolTitle: (criticActivityId: string, value: string) => void;
  onSetEditingTool: (toolId: string, value: boolean) => void;
  onSetEditToolTitle: (toolId: string, value: string) => void;
}

export function ArtpToolSection({
  tools,
  criticActivityId,
  addingTool,
  newToolTitle,
  editingTool,
  editToolTitle,
  onAddTool,
  onUpdateTool,
  onDeleteTool,
  onSetAddingTool,
  onSetNewToolTitle,
  onSetEditingTool,
  onSetEditToolTitle,
}: ArtpToolSectionProps) {
  return (
    <details className="mb-2" open>
      <summary className="cursor-pointer font-medium text-teal-700">
        Herramientas y equipos esenciales
      </summary>
      <div className="pl-4 mt-2 space-y-2">
        {tools.length === 0 ? (
          <p className="text-gray-400">No hay herramientas.</p>
        ) : (
          tools.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center justify-between bg-white border rounded p-2"
            >
              {editingTool[tool.id] ? (
                <>
                  <input
                    className="border rounded p-1 text-sm flex-1 mr-2"
                    value={editToolTitle[tool.id] ?? tool.title}
                    onChange={(e) =>
                      onSetEditToolTitle(tool.id, e.target.value)
                    }
                  />
                  <button
                    className="bg-teal-700 text-white rounded px-2 py-1 text-xs mr-1"
                    onClick={() =>
                      onUpdateTool(
                        tool.id,
                        tool.criticActivityId,
                        editToolTitle[tool.id] || tool.title
                      )
                    }
                  >
                    Guardar
                  </button>
                  <button
                    className="text-gray-500 text-xs"
                    onClick={() => onSetEditingTool(tool.id, false)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span>{tool.title}</span>
                  <div className="space-x-2">
                    <button
                      className="text-blue-600 text-xs"
                      onClick={() => {
                        onSetEditingTool(tool.id, true);
                        onSetEditToolTitle(tool.id, tool.title);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-500 text-xs"
                      onClick={() => onDeleteTool(tool.id, tool.title)}
                    >
                      Borrar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        {addingTool[criticActivityId] ? (
          <div className="flex items-center space-x-2 mt-2">
            <input
              className="border rounded p-1 text-sm flex-1"
              placeholder="Nombre de la herramienta"
              value={newToolTitle[criticActivityId] || ""}
              onChange={(e) =>
                onSetNewToolTitle(criticActivityId, e.target.value)
              }
            />
            <button
              className="bg-teal-700 text-white rounded px-2 py-1 text-xs"
              onClick={() => onAddTool(criticActivityId)}
            >
              Guardar
            </button>
            <button
              className="text-gray-500 text-xs"
              onClick={() => onSetAddingTool(criticActivityId, false)}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            className="mt-2 text-teal-700 text-xs"
            onClick={() => onSetAddingTool(criticActivityId, true)}
          >
            Añadir herramienta
          </button>
        )}
      </div>
    </details>
  );
}
