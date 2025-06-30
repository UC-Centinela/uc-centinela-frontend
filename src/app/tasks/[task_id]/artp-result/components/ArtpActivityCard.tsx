import { ArtpCriticActivity } from "@/services/artp";
import { ArtpToolSection } from "./ArtpToolSection";
import { ArtpUndesiredEventSection } from "./ArtpUndesiredEventSection";
import { ArtpControlSection } from "./ArtpControlSection";
import { ArtpVerificationQuestionSection } from "./ArtpVerificationQuestionSection";

interface ArtpActivityCardProps {
  activity: ArtpCriticActivity;
  index: number;
  tools: any[];
  undesiredEvents: any[];
  controls: any[];
  verificationQuestions: any[];
  // Estado para herramientas
  addingTool: { [criticActivityId: string]: boolean };
  newToolTitle: { [criticActivityId: string]: string };
  editingTool: { [toolId: string]: boolean };
  editToolTitle: { [toolId: string]: string };
  // Estado para eventos no deseados
  addingUndesiredEvent: { [criticActivityId: string]: boolean };
  newUndesiredEvent: {
    [criticActivityId: string]: { title: string; description: string | null };
  };
  editingUndesiredEvent: { [eventId: string]: boolean };
  editUndesiredEvent: {
    [eventId: string]: { title: string; description: string | null };
  };
  // Estado para controles
  addingControl: { [criticActivityId: string]: boolean };
  newControl: {
    [criticActivityId: string]: { title: string; description: string | null };
  };
  editingControl: { [controlId: string]: boolean };
  editControl: {
    [controlId: string]: { title: string; description: string | null };
  };
  // Estado para preguntas de verificación
  addingVerificationQuestion: { [criticActivityId: string]: boolean };
  newVerificationQuestion: {
    [criticActivityId: string]: { title: string; description: string | null };
  };
  editingVerificationQuestion: { [questionId: string]: boolean };
  editVerificationQuestion: {
    [questionId: string]: { title: string; description: string | null };
  };
  // Handlers para herramientas
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
  // Handlers para eventos no deseados
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
  // Handlers para controles
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
  // Handlers para preguntas de verificación
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

export function ArtpActivityCard({
  activity,
  index,
  tools,
  undesiredEvents,
  controls,
  verificationQuestions,
  // Herramientas
  addingTool,
  newToolTitle,
  editingTool,
  editToolTitle,
  // Eventos no deseados
  addingUndesiredEvent,
  newUndesiredEvent,
  editingUndesiredEvent,
  editUndesiredEvent,
  // Controles
  addingControl,
  newControl,
  editingControl,
  editControl,
  // Preguntas de verificación
  addingVerificationQuestion,
  newVerificationQuestion,
  editingVerificationQuestion,
  editVerificationQuestion,
  // Handlers para herramientas
  onAddTool,
  onUpdateTool,
  onDeleteTool,
  onSetAddingTool,
  onSetNewToolTitle,
  onSetEditingTool,
  onSetEditToolTitle,
  // Handlers para eventos no deseados
  onAddUndesiredEvent,
  onUpdateUndesiredEvent,
  onDeleteUndesiredEvent,
  onSetAddingUndesiredEvent,
  onSetNewUndesiredEvent,
  onSetEditingUndesiredEvent,
  onSetEditUndesiredEvent,
  // Handlers para controles
  onAddControl,
  onUpdateControl,
  onDeleteControl,
  onSetAddingControl,
  onSetNewControl,
  onSetEditingControl,
  onSetEditControl,
  // Handlers para preguntas de verificación
  onAddVerificationQuestion,
  onUpdateVerificationQuestion,
  onDeleteVerificationQuestion,
  onSetAddingVerificationQuestion,
  onSetNewVerificationQuestion,
  onSetEditingVerificationQuestion,
  onSetEditVerificationQuestion,
}: ArtpActivityCardProps) {
  return (
    <div key={activity.id} className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-base">
          {index + 1}. {activity.title}
        </span>
        <span className="text-xs text-gray-500">
          0/4 {/* Placeholder para progreso */}
        </span>
      </div>

      <ArtpToolSection
        tools={tools}
        criticActivityId={activity.id}
        addingTool={addingTool}
        newToolTitle={newToolTitle}
        editingTool={editingTool}
        editToolTitle={editToolTitle}
        onAddTool={onAddTool}
        onUpdateTool={onUpdateTool}
        onDeleteTool={onDeleteTool}
        onSetAddingTool={onSetAddingTool}
        onSetNewToolTitle={onSetNewToolTitle}
        onSetEditingTool={onSetEditingTool}
        onSetEditToolTitle={onSetEditToolTitle}
      />

      <ArtpUndesiredEventSection
        undesiredEvents={undesiredEvents}
        criticActivityId={activity.id}
        addingUndesiredEvent={addingUndesiredEvent}
        newUndesiredEvent={newUndesiredEvent}
        editingUndesiredEvent={editingUndesiredEvent}
        editUndesiredEvent={editUndesiredEvent}
        onAddUndesiredEvent={onAddUndesiredEvent}
        onUpdateUndesiredEvent={onUpdateUndesiredEvent}
        onDeleteUndesiredEvent={onDeleteUndesiredEvent}
        onSetAddingUndesiredEvent={onSetAddingUndesiredEvent}
        onSetNewUndesiredEvent={onSetNewUndesiredEvent}
        onSetEditingUndesiredEvent={onSetEditingUndesiredEvent}
        onSetEditUndesiredEvent={onSetEditUndesiredEvent}
      />

      <ArtpControlSection
        controls={controls}
        criticActivityId={activity.id}
        addingControl={addingControl}
        newControl={newControl}
        editingControl={editingControl}
        editControl={editControl}
        onAddControl={onAddControl}
        onUpdateControl={onUpdateControl}
        onDeleteControl={onDeleteControl}
        onSetAddingControl={onSetAddingControl}
        onSetNewControl={onSetNewControl}
        onSetEditingControl={onSetEditingControl}
        onSetEditControl={onSetEditControl}
      />

      <ArtpVerificationQuestionSection
        verificationQuestions={verificationQuestions}
        criticActivityId={activity.id}
        addingVerificationQuestion={addingVerificationQuestion}
        newVerificationQuestion={newVerificationQuestion}
        editingVerificationQuestion={editingVerificationQuestion}
        editVerificationQuestion={editVerificationQuestion}
        onAddVerificationQuestion={onAddVerificationQuestion}
        onUpdateVerificationQuestion={onUpdateVerificationQuestion}
        onDeleteVerificationQuestion={onDeleteVerificationQuestion}
        onSetAddingVerificationQuestion={onSetAddingVerificationQuestion}
        onSetNewVerificationQuestion={onSetNewVerificationQuestion}
        onSetEditingVerificationQuestion={onSetEditingVerificationQuestion}
        onSetEditVerificationQuestion={onSetEditVerificationQuestion}
      />
    </div>
  );
}
