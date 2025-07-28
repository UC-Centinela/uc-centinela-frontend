import { ArtpControl } from "@/services/artp";

interface ArtpControlSectionProps {
  controls: ArtpControl[];
  criticActivityId: string;
  addingControl: { [criticActivityId: string]: boolean };
  newControl: {
    [criticActivityId: string]: { title: string; description: string | null };
  };
  editingControl: { [controlId: string]: boolean };
  editControl: {
    [controlId: string]: { title: string; description: string | null };
  };
  onAddControl: (criticActivityId: string) => void;
  onUpdateControl: (
    controlId: string,
    criticActivityId: string,
    newTitle: string,
    newDescription: string | null
  ) => void;
  onDeleteControl: (controlId: string, controlTitle: string) => void;
  onSetAddingControl: (criticActivityId: string, value: boolean) => void;
  onSetNewControl: (
    criticActivityId: string,
    field: "title" | "description",
    value: string
  ) => void;
  onSetEditingControl: (controlId: string, value: boolean) => void;
  onSetEditControl: (
    controlId: string,
    field: "title" | "description",
    value: string
  ) => void;
}

export function ArtpControlSection({
  controls,
  criticActivityId,
  addingControl,
  newControl,
  editingControl,
  editControl,
  onAddControl,
  onUpdateControl,
  onDeleteControl,
  onSetAddingControl,
  onSetNewControl,
  onSetEditingControl,
  onSetEditControl,
}: ArtpControlSectionProps) {
  return (
    <details className="mb-2" open>
      <summary className="cursor-pointer font-medium text-teal-700">
        Controles
      </summary>
      <div className="pl-4 mt-2 space-y-2">
        {controls.length === 0 ? (
          <p className="text-gray-400">No hay controles.</p>
        ) : (
          controls.map((control) => (
            <div key={control.id} className="bg-white border rounded p-2">
              {editingControl[control.id] ? (
                <>
                  <input
                    className="border rounded p-1 text-sm flex-1 mb-1 w-full"
                    value={editControl[control.id]?.title ?? control.title}
                    onChange={(e) =>
                      onSetEditControl(control.id, "title", e.target.value)
                    }
                    placeholder="Título"
                  />
                  <textarea
                    className="border rounded p-1 text-sm flex-1 mb-1 w-full"
                    value={
                      editControl[control.id]?.description ??
                      control.description
                    }
                    onChange={(e) =>
                      onSetEditControl(
                        control.id,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Descripción"
                  />
                  <button
                    className="bg-teal-700 text-white rounded px-2 py-1 text-xs mr-1"
                    onClick={() => {
                      const newTitle = editControl[control.id]?.title?.trim();
                      const newDesc =
                        editControl[control.id]?.description?.trim();
                      if (newTitle) {
                        onUpdateControl(
                          control.id,
                          control.criticActivityId,
                          newTitle,
                          newDesc || null
                        );
                      }
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    className="text-gray-500 text-xs"
                    onClick={() => onSetEditingControl(control.id, false)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span>{control.title}</span>
                    <div className="space-x-2">
                      <button
                        className="text-blue-600 text-xs"
                        onClick={() => {
                          onSetEditingControl(control.id, true);
                          onSetEditControl(control.id, "title", control.title);
                          onSetEditControl(
                            control.id,
                            "description",
                            control.description || ""
                          );
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-500 text-xs"
                        onClick={() =>
                          onDeleteControl(control.id, control.title)
                        }
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {control.description}
                  </div>
                </>
              )}
            </div>
          ))
        )}
        {addingControl[criticActivityId] ? (
          <div className="flex flex-col space-y-2 mt-2">
            <input
              className="border rounded p-1 text-sm flex-1"
              placeholder="Título"
              value={newControl[criticActivityId]?.title || ""}
              onChange={(e) =>
                onSetNewControl(criticActivityId, "title", e.target.value)
              }
            />
            <textarea
              className="border rounded p-1 text-sm flex-1"
              placeholder="Descripción"
              value={newControl[criticActivityId]?.description || ""}
              onChange={(e) =>
                onSetNewControl(criticActivityId, "description", e.target.value)
              }
            />
            <div className="flex space-x-2">
              <button
                className="bg-teal-700 text-white rounded px-2 py-1 text-xs"
                onClick={() => onAddControl(criticActivityId)}
              >
                Guardar
              </button>
              <button
                className="text-gray-500 text-xs"
                onClick={() => onSetAddingControl(criticActivityId, false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            className="mt-2 text-teal-700 text-xs"
            onClick={() => onSetAddingControl(criticActivityId, true)}
          >
            Añadir control
          </button>
        )}
      </div>
    </details>
  );
}
