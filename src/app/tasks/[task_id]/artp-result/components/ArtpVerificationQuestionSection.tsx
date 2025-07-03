import { ArtpVerificationQuestion } from "@/services/artp";

interface ArtpVerificationQuestionSectionProps {
  verificationQuestions: ArtpVerificationQuestion[];
  criticActivityId: string;
  addingVerificationQuestion: { [criticActivityId: string]: boolean };
  newVerificationQuestion: {
    [criticActivityId: string]: { title: string; description: string | null };
  };
  editingVerificationQuestion: { [questionId: string]: boolean };
  editVerificationQuestion: {
    [questionId: string]: { title: string; description: string | null };
  };
  onAddVerificationQuestion: (criticActivityId: string) => void;
  onUpdateVerificationQuestion: (
    questionId: string,
    criticActivityId: string,
    newTitle: string,
    newDescription: string | null
  ) => void;
  onDeleteVerificationQuestion: (
    questionId: string,
    questionTitle: string
  ) => void;
  onSetAddingVerificationQuestion: (
    criticActivityId: string,
    value: boolean
  ) => void;
  onSetNewVerificationQuestion: (
    criticActivityId: string,
    field: "title" | "description",
    value: string
  ) => void;
  onSetEditingVerificationQuestion: (
    questionId: string,
    value: boolean
  ) => void;
  onSetEditVerificationQuestion: (
    questionId: string,
    field: "title" | "description",
    value: string
  ) => void;
}

export function ArtpVerificationQuestionSection({
  verificationQuestions,
  criticActivityId,
  addingVerificationQuestion,
  newVerificationQuestion,
  editingVerificationQuestion,
  editVerificationQuestion,
  onAddVerificationQuestion,
  onUpdateVerificationQuestion,
  onDeleteVerificationQuestion,
  onSetAddingVerificationQuestion,
  onSetNewVerificationQuestion,
  onSetEditingVerificationQuestion,
  onSetEditVerificationQuestion,
}: ArtpVerificationQuestionSectionProps) {
  return (
    <details className="mb-2" open>
      <summary className="cursor-pointer font-medium text-teal-700">
        Pregunta Verificación controles
      </summary>
      <div className="pl-4 mt-2 space-y-2">
        {verificationQuestions.length === 0 ? (
          <p className="text-gray-400">No hay preguntas de verificación.</p>
        ) : (
          verificationQuestions.map((question) => (
            <div key={question.id} className="bg-white border rounded p-2">
              {editingVerificationQuestion[question.id] ? (
                <>
                  <input
                    className="border rounded p-1 text-sm flex-1 mb-1 w-full"
                    value={
                      editVerificationQuestion[question.id]?.title ??
                      question.title
                    }
                    onChange={(e) =>
                      onSetEditVerificationQuestion(
                        question.id,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Título"
                  />
                  <textarea
                    className="border rounded p-1 text-sm flex-1 mb-1 w-full"
                    value={
                      editVerificationQuestion[question.id]?.description ??
                      question.description
                    }
                    onChange={(e) =>
                      onSetEditVerificationQuestion(
                        question.id,
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
                        editVerificationQuestion[question.id]?.title?.trim();
                      const newDesc =
                        editVerificationQuestion[
                          question.id
                        ]?.description?.trim();
                      if (newTitle) {
                        onUpdateVerificationQuestion(
                          question.id,
                          question.criticActivityId,
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
                    onClick={() =>
                      onSetEditingVerificationQuestion(question.id, false)
                    }
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span>{question.title}</span>
                    <div className="space-x-2">
                      <button
                        className="text-blue-600 text-xs"
                        onClick={() => {
                          onSetEditingVerificationQuestion(question.id, true);
                          onSetEditVerificationQuestion(
                            question.id,
                            "title",
                            question.title
                          );
                          onSetEditVerificationQuestion(
                            question.id,
                            "description",
                            question.description || ""
                          );
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="text-red-500 text-xs"
                        onClick={() =>
                          onDeleteVerificationQuestion(
                            question.id,
                            question.title
                          )
                        }
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {question.description}
                  </div>
                </>
              )}
            </div>
          ))
        )}
        {addingVerificationQuestion[criticActivityId] ? (
          <div className="flex flex-col space-y-2 mt-2">
            <input
              className="border rounded p-1 text-sm flex-1"
              placeholder="Título"
              value={newVerificationQuestion[criticActivityId]?.title || ""}
              onChange={(e) =>
                onSetNewVerificationQuestion(
                  criticActivityId,
                  "title",
                  e.target.value
                )
              }
            />
            <textarea
              className="border rounded p-1 text-sm flex-1"
              placeholder="Descripción"
              value={
                newVerificationQuestion[criticActivityId]?.description || ""
              }
              onChange={(e) =>
                onSetNewVerificationQuestion(
                  criticActivityId,
                  "description",
                  e.target.value
                )
              }
            />
            <div className="flex space-x-2">
              <button
                className="bg-teal-700 text-white rounded px-2 py-1 text-xs"
                onClick={() => onAddVerificationQuestion(criticActivityId)}
              >
                Guardar
              </button>
              <button
                className="text-gray-500 text-xs"
                onClick={() =>
                  onSetAddingVerificationQuestion(criticActivityId, false)
                }
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            className="mt-2 text-teal-700 text-xs"
            onClick={() =>
              onSetAddingVerificationQuestion(criticActivityId, true)
            }
          >
            Añadir pregunta
          </button>
        )}
      </div>
    </details>
  );
}
