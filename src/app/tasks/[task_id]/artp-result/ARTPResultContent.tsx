"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GenerateArtpResponse } from "@/services/artp";
import { useArtpState } from "./hooks/useArtpState";
import { useArtpActions } from "./hooks/useArtpActions";
import { ArtpDeleteDialog } from "./ArtpDeleteDialog";
import { ArtpProgressBar } from "./components/ArtpProgressBar";
import { ArtpActivityCard } from "./components/ArtpActivityCard";

interface ARTPResultContentProps {
  taskId: string;
  taskTitle: string;
  artpData: GenerateArtpResponse;
}

export default function ARTPResultContent({
  taskId,
  taskTitle,
  artpData,
}: ARTPResultContentProps) {
  const state = useArtpState(artpData);
  const actions = useArtpActions();

  // Handlers para herramientas
  const handleAddTool = async (criticActivityId: string) => {
    const title = state.newToolTitle[criticActivityId]?.trim();
    if (!title) return;

    await actions.handleAddTool(
      criticActivityId,
      title,
      state.setLocalTools,
      state.setNewToolTitle,
      state.setAddingTool
    );
  };

  const handleUpdateTool = async (
    toolId: string,
    criticActivityId: string,
    newTitle: string
  ) => {
    await actions.handleUpdateTool(
      toolId,
      criticActivityId,
      newTitle,
      state.setLocalTools,
      state.setEditingTool
    );
  };

  const handleDeleteTool = async (toolId: string, toolName: string) => {
    state.setDeleteDialog({ open: true, toolId, toolName });
  };

  // Handlers para eventos no deseados
  const handleAddUndesiredEvent = async (criticActivityId: string) => {
    const title = state.newUndesiredEvent[criticActivityId]?.title?.trim();
    const description =
      state.newUndesiredEvent[criticActivityId]?.description?.trim();
    if (!title) return;

    await actions.handleAddUndesiredEvent(
      criticActivityId,
      title,
      description || null,
      state.setLocalUndesiredEvents,
      state.setNewUndesiredEvent,
      state.setAddingUndesiredEvent
    );
  };

  const handleUpdateUndesiredEvent = async (
    eventId: string,
    criticActivityId: string,
    newTitle: string,
    newDescription: string | null
  ) => {
    await actions.handleUpdateUndesiredEvent(
      eventId,
      criticActivityId,
      newTitle,
      newDescription,
      state.setLocalUndesiredEvents,
      state.setEditingUndesiredEvent
    );
  };

  const handleDeleteUndesiredEvent = async (
    eventId: string,
    eventTitle: string
  ) => {
    state.setDeleteUndesiredEventDialog({ open: true, eventId, eventTitle });
  };

  // Handlers para controles
  const handleAddControl = async (criticActivityId: string) => {
    const title = state.newControl[criticActivityId]?.title?.trim();
    const description = state.newControl[criticActivityId]?.description?.trim();
    if (!title) return;

    await actions.handleAddControl(
      criticActivityId,
      title,
      description || null,
      state.setLocalControls,
      state.setNewControl,
      state.setAddingControl
    );
  };

  const handleUpdateControl = async (
    controlId: string,
    criticActivityId: string,
    newTitle: string,
    newDescription: string | null
  ) => {
    await actions.handleUpdateControl(
      controlId,
      criticActivityId,
      newTitle,
      newDescription,
      state.setLocalControls,
      state.setEditingControl
    );
  };

  const handleDeleteControl = async (
    controlId: string,
    controlTitle: string
  ) => {
    state.setDeleteControlDialog({ open: true, controlId, controlTitle });
  };

  // Handlers para preguntas de verificación
  const handleAddVerificationQuestion = async (criticActivityId: string) => {
    const title =
      state.newVerificationQuestion[criticActivityId]?.title?.trim();
    const description =
      state.newVerificationQuestion[criticActivityId]?.description?.trim();
    if (!title) return;

    await actions.handleAddVerificationQuestion(
      criticActivityId,
      title,
      description || null,
      state.setLocalVerificationQuestions,
      state.setNewVerificationQuestion,
      state.setAddingVerificationQuestion
    );
  };

  const handleUpdateVerificationQuestion = async (
    questionId: string,
    criticActivityId: string,
    newTitle: string,
    newDescription: string | null
  ) => {
    await actions.handleUpdateVerificationQuestion(
      questionId,
      criticActivityId,
      newTitle,
      newDescription,
      state.setLocalVerificationQuestions,
      state.setEditingVerificationQuestion
    );
  };

  const handleDeleteVerificationQuestion = async (
    questionId: string,
    questionTitle: string
  ) => {
    state.setDeleteVerificationQuestionDialog({
      open: true,
      questionId,
      questionTitle,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-6">
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-teal-800 mb-6 mt-4">
          Resultado ARTP
        </h1>

        <ArtpProgressBar />
      </div>

      <div className="max-w-2xl mx-auto px-2 mt-8">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-bold text-teal-800 mb-2 text-center">
            Propuesta de ARTP (Análisis de Riesgo de la Tarea Planificado)
          </h2>
          <p className="text-gray-700 text-center mb-6">
            Para la tarea &ldquo;{taskTitle}&rdquo; se recomienda lo siguiente:
          </p>

          <div className="space-y-6">
            {artpData.criticActivities.length === 0 ? (
              <p className="text-gray-500">No hay actividades críticas.</p>
            ) : (
              artpData.criticActivities.map((activity, idx) => {
                // Relacionar items por criticActivityId
                const controls = state.localControls.filter(
                  (c) => c.criticActivityId === activity.id
                );
                const tools = state.localTools.filter(
                  (t) => t.criticActivityId === activity.id
                );
                const undesiredEvents = state.localUndesiredEvents.filter(
                  (e) => e.criticActivityId === activity.id
                );
                const verificationQuestions =
                  state.localVerificationQuestions.filter(
                    (q) => q.criticActivityId === activity.id
                  );

                return (
                  <ArtpActivityCard
                    key={activity.id}
                    activity={activity}
                    index={idx}
                    tools={tools}
                    undesiredEvents={undesiredEvents}
                    controls={controls}
                    verificationQuestions={verificationQuestions}
                    // Estado para herramientas
                    addingTool={state.addingTool}
                    newToolTitle={state.newToolTitle}
                    editingTool={state.editingTool}
                    editToolTitle={state.editToolTitle}
                    // Estado para eventos no deseados
                    addingUndesiredEvent={state.addingUndesiredEvent}
                    newUndesiredEvent={state.newUndesiredEvent}
                    editingUndesiredEvent={state.editingUndesiredEvent}
                    editUndesiredEvent={state.editUndesiredEvent}
                    // Estado para controles
                    addingControl={state.addingControl}
                    newControl={state.newControl}
                    editingControl={state.editingControl}
                    editControl={state.editControl}
                    // Estado para preguntas de verificación
                    addingVerificationQuestion={
                      state.addingVerificationQuestion
                    }
                    newVerificationQuestion={state.newVerificationQuestion}
                    editingVerificationQuestion={
                      state.editingVerificationQuestion
                    }
                    editVerificationQuestion={state.editVerificationQuestion}
                    // Handlers para herramientas
                    onAddTool={handleAddTool}
                    onUpdateTool={handleUpdateTool}
                    onDeleteTool={handleDeleteTool}
                    onSetAddingTool={(criticActivityId, value) =>
                      state.setAddingTool((prev) => ({
                        ...prev,
                        [criticActivityId]: value,
                      }))
                    }
                    onSetNewToolTitle={(criticActivityId, value) =>
                      state.setNewToolTitle((prev) => ({
                        ...prev,
                        [criticActivityId]: value,
                      }))
                    }
                    onSetEditingTool={(toolId, value) =>
                      state.setEditingTool((prev) => ({
                        ...prev,
                        [toolId]: value,
                      }))
                    }
                    onSetEditToolTitle={(toolId, value) =>
                      state.setEditToolTitle((prev) => ({
                        ...prev,
                        [toolId]: value,
                      }))
                    }
                    // Handlers para eventos no deseados
                    onAddUndesiredEvent={handleAddUndesiredEvent}
                    onUpdateUndesiredEvent={handleUpdateUndesiredEvent}
                    onDeleteUndesiredEvent={handleDeleteUndesiredEvent}
                    onSetAddingUndesiredEvent={(criticActivityId, value) =>
                      state.setAddingUndesiredEvent((prev) => ({
                        ...prev,
                        [criticActivityId]: value,
                      }))
                    }
                    onSetNewUndesiredEvent={(criticActivityId, field, value) =>
                      state.setNewUndesiredEvent((prev) => ({
                        ...prev,
                        [criticActivityId]: {
                          ...prev[criticActivityId],
                          [field]: value,
                        },
                      }))
                    }
                    onSetEditingUndesiredEvent={(eventId, value) =>
                      state.setEditingUndesiredEvent((prev) => ({
                        ...prev,
                        [eventId]: value,
                      }))
                    }
                    onSetEditUndesiredEvent={(eventId, field, value) =>
                      state.setEditUndesiredEvent((prev) => ({
                        ...prev,
                        [eventId]: {
                          ...prev[eventId],
                          [field]: value,
                        },
                      }))
                    }
                    // Handlers para controles
                    onAddControl={handleAddControl}
                    onUpdateControl={handleUpdateControl}
                    onDeleteControl={handleDeleteControl}
                    onSetAddingControl={(criticActivityId, value) =>
                      state.setAddingControl((prev) => ({
                        ...prev,
                        [criticActivityId]: value,
                      }))
                    }
                    onSetNewControl={(criticActivityId, field, value) =>
                      state.setNewControl((prev) => ({
                        ...prev,
                        [criticActivityId]: {
                          ...prev[criticActivityId],
                          [field]: value,
                        },
                      }))
                    }
                    onSetEditingControl={(controlId, value) =>
                      state.setEditingControl((prev) => ({
                        ...prev,
                        [controlId]: value,
                      }))
                    }
                    onSetEditControl={(controlId, field, value) =>
                      state.setEditControl((prev) => ({
                        ...prev,
                        [controlId]: {
                          ...prev[controlId],
                          [field]: value,
                        },
                      }))
                    }
                    // Handlers para preguntas de verificación
                    onAddVerificationQuestion={handleAddVerificationQuestion}
                    onUpdateVerificationQuestion={
                      handleUpdateVerificationQuestion
                    }
                    onDeleteVerificationQuestion={
                      handleDeleteVerificationQuestion
                    }
                    onSetAddingVerificationQuestion={(
                      criticActivityId,
                      value
                    ) =>
                      state.setAddingVerificationQuestion((prev) => ({
                        ...prev,
                        [criticActivityId]: value,
                      }))
                    }
                    onSetNewVerificationQuestion={(
                      criticActivityId,
                      field,
                      value
                    ) =>
                      state.setNewVerificationQuestion((prev) => ({
                        ...prev,
                        [criticActivityId]: {
                          ...prev[criticActivityId],
                          [field]: value,
                        },
                      }))
                    }
                    onSetEditingVerificationQuestion={(questionId, value) =>
                      state.setEditingVerificationQuestion((prev) => ({
                        ...prev,
                        [questionId]: value,
                      }))
                    }
                    onSetEditVerificationQuestion={(questionId, field, value) =>
                      state.setEditVerificationQuestion((prev) => ({
                        ...prev,
                        [questionId]: {
                          ...prev[questionId],
                          [field]: value,
                        },
                      }))
                    }
                  />
                );
              })
            )}
          </div>

          <Button variant="outline" className="w-full mt-8">
            <Link href={`/tasks/${taskId}/send`}>Continuar el envío</Link>
          </Button>
        </div>
      </div>

      {/* Diálogo de borrado para herramientas */}
      <ArtpDeleteDialog
        isOpen={state.deleteDialog.open}
        onClose={() => state.setDeleteDialog({ open: false })}
        onConfirmDelete={async () => {
          if (state.deleteDialog.toolId) {
            const ok = await actions.handleDeleteTool(
              state.deleteDialog.toolId,
              state.setLocalTools
            );
            if (ok) {
              state.setDeleteDialog({ open: false });
            }
          }
        }}
        itemName={state.deleteDialog.toolName || ""}
        itemTypeLabel="herramienta"
      />

      {/* Diálogo de borrado para eventos no deseados */}
      <ArtpDeleteDialog
        isOpen={state.deleteUndesiredEventDialog.open}
        onClose={() => state.setDeleteUndesiredEventDialog({ open: false })}
        onConfirmDelete={async () => {
          if (state.deleteUndesiredEventDialog.eventId) {
            const ok = await actions.handleDeleteUndesiredEvent(
              state.deleteUndesiredEventDialog.eventId,
              state.setLocalUndesiredEvents
            );
            if (ok) {
              state.setDeleteUndesiredEventDialog({ open: false });
            }
          }
        }}
        itemName={state.deleteUndesiredEventDialog.eventTitle || ""}
        itemTypeLabel="evento no deseado"
      />

      {/* Diálogo de borrado para controles */}
      <ArtpDeleteDialog
        isOpen={state.deleteControlDialog.open}
        onClose={() => state.setDeleteControlDialog({ open: false })}
        onConfirmDelete={async () => {
          if (state.deleteControlDialog.controlId) {
            const ok = await actions.handleDeleteControl(
              state.deleteControlDialog.controlId,
              state.setLocalControls
            );
            if (ok) {
              state.setDeleteControlDialog({ open: false });
            }
          }
        }}
        itemName={state.deleteControlDialog.controlTitle || ""}
        itemTypeLabel="control"
      />

      {/* Diálogo de borrado para preguntas de verificación */}
      <ArtpDeleteDialog
        isOpen={state.deleteVerificationQuestionDialog.open}
        onClose={() =>
          state.setDeleteVerificationQuestionDialog({ open: false })
        }
        onConfirmDelete={async () => {
          if (state.deleteVerificationQuestionDialog.questionId) {
            const ok = await actions.handleDeleteVerificationQuestion(
              state.deleteVerificationQuestionDialog.questionId,
              state.setLocalVerificationQuestions
            );
            if (ok) {
              state.setDeleteVerificationQuestionDialog({ open: false });
            }
          }
        }}
        itemName={state.deleteVerificationQuestionDialog.questionTitle || ""}
        itemTypeLabel="pregunta de verificación"
      />
    </div>
  );
}
