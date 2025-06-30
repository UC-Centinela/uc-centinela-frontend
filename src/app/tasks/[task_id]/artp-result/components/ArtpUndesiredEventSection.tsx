import { ArtpUndesiredEvent } from "@/services/artp";

interface ArtpUndesiredEventSectionProps {
  undesiredEvents: ArtpUndesiredEvent[];
  criticActivityId: string;
  addingUndesiredEvent: { [criticActivityId: string]: boolean };
  newUndesiredEvent: {
    [criticActivityId: string]: { title: string; description: string | null };
  };
  editingUndesiredEvent: { [eventId: string]: boolean };
  editUndesiredEvent: {
    [eventId: string]: { title: string; description: string | null };
  };
  onAddUndesiredEvent: (criticActivityId: string) => void;
  onUpdateUndesiredEvent: (
    eventId: string,
    criticActivityId: string,
    newTitle: string,
    newDescription: string | null
  ) => void;
  onDeleteUndesiredEvent: (eventId: string, eventTitle: string) => void;
  onSetAddingUndesiredEvent: (criticActivityId: string, value: boolean) => void;
  onSetNewUndesiredEvent: (
    criticActivityId: string,
    field: "title" | "description",
    value: string
  ) => void;
  onSetEditingUndesiredEvent: (eventId: string, value: boolean) => void;
  onSetEditUndesiredEvent: (
    eventId: string,
    field: "title" | "description",
    value: string
  ) => void;
}

export function ArtpUndesiredEventSection({
  undesiredEvents,
  criticActivityId,
  addingUndesiredEvent,
  newUndesiredEvent,
  editingUndesiredEvent,
  editUndesiredEvent,
  onAddUndesiredEvent,
  onUpdateUndesiredEvent,
  onDeleteUndesiredEvent,
  onSetAddingUndesiredEvent,
  onSetNewUndesiredEvent,
  onSetEditingUndesiredEvent,
  onSetEditUndesiredEvent,
}: ArtpUndesiredEventSectionProps) {
  return (
    <details className="mb-2" open>
      <summary className="cursor-pointer font-medium text-teal-700">
        Evento no deseado o consecuencia
      </summary>
      <div className="pl-4 mt-2 space-y-2">
        {undesiredEvents.length === 0 ? (
          <p className="text-gray-400">No hay eventos no deseados.</p>
        ) : (
          undesiredEvents.map((event) => (
            <div key={event.id} className="bg-white border rounded p-2">
              {editingUndesiredEvent[event.id] ? (
                <>
                  <input
                    className="border rounded p-1 text-sm flex-1 mb-1 w-full"
                    value={editUndesiredEvent[event.id]?.title ?? event.title}
                    onChange={(e) =>
                      onSetEditUndesiredEvent(event.id, "title", e.target.value)
                    }
                    placeholder="Título"
                  />
                  <textarea
                    className="border rounded p-1 text-sm flex-1 mb-1 w-full"
                    value={
                      editUndesiredEvent[event.id]?.description ??
                      event.description
                    }
                    onChange={(e) =>
                      onSetEditUndesiredEvent(
                        event.id,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Descripción"
                  />
                  <button
                    className="bg-teal-700 text-white rounded px-2 py-1 text-xs mr-1"
                    onClick={() => {
                      const newTitle =
                        editUndesiredEvent[event.id]?.title?.trim();
                      const newDesc =
                        editUndesiredEvent[event.id]?.description?.trim();
                      if (newTitle) {
                        onUpdateUndesiredEvent(
                          event.id,
                          event.criticActivityId,
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
                    onClick={() => onSetEditingUndesiredEvent(event.id, false)}
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span>{event.title}</span>
                    <div className="space-x-2">
                      <button
                        className="text-blue-600 text-xs"
                        onClick={() => {
                          onSetEditingUndesiredEvent(event.id, true);
                          onSetEditUndesiredEvent(
                            event.id,
                            "title",
                            event.title
                          );
                          onSetEditUndesiredEvent(
                            event.id,
                            "description",
                            event.description || ""
                          );
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-500 text-xs"
                        onClick={() =>
                          onDeleteUndesiredEvent(event.id, event.title)
                        }
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {event.description}
                  </div>
                </>
              )}
            </div>
          ))
        )}
        {addingUndesiredEvent[criticActivityId] ? (
          <div className="flex flex-col space-y-2 mt-2">
            <input
              className="border rounded p-1 text-sm flex-1"
              placeholder="Título"
              value={newUndesiredEvent[criticActivityId]?.title || ""}
              onChange={(e) =>
                onSetNewUndesiredEvent(
                  criticActivityId,
                  "title",
                  e.target.value
                )
              }
            />
            <textarea
              className="border rounded p-1 text-sm flex-1"
              placeholder="Descripción"
              value={newUndesiredEvent[criticActivityId]?.description || ""}
              onChange={(e) =>
                onSetNewUndesiredEvent(
                  criticActivityId,
                  "description",
                  e.target.value
                )
              }
            />
            <div className="flex space-x-2">
              <button
                className="bg-teal-700 text-white rounded px-2 py-1 text-xs"
                onClick={() => onAddUndesiredEvent(criticActivityId)}
              >
                Guardar
              </button>
              <button
                className="text-gray-500 text-xs"
                onClick={() =>
                  onSetAddingUndesiredEvent(criticActivityId, false)
                }
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            className="mt-2 text-teal-700 text-xs"
            onClick={() => onSetAddingUndesiredEvent(criticActivityId, true)}
          >
            Añadir evento
          </button>
        )}
      </div>
    </details>
  );
}
