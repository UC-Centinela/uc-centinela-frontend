import { createTool, deleteTool, updateTool } from "@/services/tool";
import {
  createUndesiredEvent,
  deleteUndesiredEvent,
  updateUndesiredEvent,
} from "@/services/undesiredEvent";
import {
  createControl,
  deleteControl,
  updateControl,
} from "@/services/control";
import {
  createVerificationQuestion,
  deleteVerificationQuestion,
  updateVerificationQuestion,
} from "@/services/verificationQuestion";
import {
  ArtpTool,
  ArtpUndesiredEvent,
  ArtpControl,
  ArtpVerificationQuestion,
} from "@/services/artp";

export function useArtpActions() {
  // Acciones para herramientas
  const handleAddTool = async (
    criticActivityId: string,
    title: string,
    setLocalTools: React.Dispatch<React.SetStateAction<ArtpTool[]>>,
    setNewToolTitle: React.Dispatch<
      React.SetStateAction<{ [key: string]: string }>
    >,
    setAddingTool: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
  ) => {
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return;

    const created = await createTool({ criticActivityId, title: trimmedTitle });
    if (created) {
      setLocalTools((prev) => [...prev, created]);
      setNewToolTitle((prev) => ({ ...prev, [criticActivityId]: "" }));
      setAddingTool((prev) => ({ ...prev, [criticActivityId]: false }));
    }
  };

  const handleUpdateTool = async (
    toolId: string,
    criticActivityId: string,
    newTitle: string,
    setLocalTools: React.Dispatch<React.SetStateAction<ArtpTool[]>>,
    setEditingTool: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
  ) => {
    const trimmedTitle = newTitle?.trim();
    if (!trimmedTitle) return;

    const updated = await updateTool({
      criticActivityId,
      id: toolId,
      title: trimmedTitle,
    });
    if (updated) {
      setLocalTools((prev) =>
        prev.map((t) => (t.id === toolId ? { ...t, title: updated.title } : t))
      );
      setEditingTool((prev) => ({
        ...prev,
        [toolId]: false,
      }));
    }
  };

  const handleDeleteTool = async (
    toolId: string,
    setLocalTools: React.Dispatch<React.SetStateAction<ArtpTool[]>>
  ) => {
    const ok = await deleteTool(toolId);
    if (ok) {
      setLocalTools((prev) => prev.filter((t) => t.id !== toolId));
    }
    return ok;
  };

  // Acciones para eventos no deseados
  const handleAddUndesiredEvent = async (
    criticActivityId: string,
    title: string,
    description: string | null,
    setLocalUndesiredEvents: React.Dispatch<
      React.SetStateAction<ArtpUndesiredEvent[]>
    >,
    setNewUndesiredEvent: React.Dispatch<
      React.SetStateAction<{
        [key: string]: { title: string; description: string | null };
      }>
    >,
    setAddingUndesiredEvent: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
  ) => {
    const trimmedTitle = title?.trim();
    let trimmedDescription = description?.trim();
    if (!trimmedTitle) return;
    if (!trimmedDescription) trimmedDescription = undefined;

    const created = await createUndesiredEvent({
      criticActivityId,
      title: trimmedTitle,
      description: trimmedDescription as string | undefined,
    });
    if (created) {
      setLocalUndesiredEvents((prev) => [...prev, created]);
      setNewUndesiredEvent((prev) => ({
        ...prev,
        [criticActivityId]: {
          title: "",
          description: "",
        },
      }));
      setAddingUndesiredEvent((prev) => ({
        ...prev,
        [criticActivityId]: false,
      }));
    }
  };

  const handleUpdateUndesiredEvent = async (
    eventId: string,
    criticActivityId: string,
    newTitle: string,
    newDescription: string | null,
    setLocalUndesiredEvents: React.Dispatch<
      React.SetStateAction<ArtpUndesiredEvent[]>
    >,
    setEditingUndesiredEvent: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
  ) => {
    const trimmedTitle = newTitle?.trim();
    let trimmedDescription = newDescription?.trim();
    if (!trimmedTitle) return;
    if (!trimmedDescription) trimmedDescription = undefined;

    const updated = await updateUndesiredEvent({
      criticActivityId,
      id: eventId,
      title: trimmedTitle,
      description: trimmedDescription as string | undefined,
    });
    if (updated) {
      setLocalUndesiredEvents((prev) =>
        prev.map((ev) => (ev.id === eventId ? updated : ev))
      );
      setEditingUndesiredEvent((prev) => ({
        ...prev,
        [eventId]: false,
      }));
    }
  };

  const handleDeleteUndesiredEvent = async (
    eventId: string,
    setLocalUndesiredEvents: React.Dispatch<
      React.SetStateAction<ArtpUndesiredEvent[]>
    >
  ) => {
    const ok = await deleteUndesiredEvent(eventId);
    if (ok) {
      setLocalUndesiredEvents((prev) => prev.filter((e) => e.id !== eventId));
    }
    return ok;
  };

  // Acciones para controles
  const handleAddControl = async (
    criticActivityId: string,
    title: string,
    description: string | null,
    setLocalControls: React.Dispatch<React.SetStateAction<ArtpControl[]>>,
    setNewControl: React.Dispatch<
      React.SetStateAction<{
        [key: string]: { title: string; description: string | null };
      }>
    >,
    setAddingControl: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
  ) => {
    const trimmedTitle = title?.trim();
    let trimmedDescription = description?.trim();
    if (!trimmedTitle) return;
    if (!trimmedDescription) trimmedDescription = undefined;

    const created = await createControl({
      criticActivityId,
      title: trimmedTitle,
      description: trimmedDescription as string | undefined,
    });
    if (created) {
      setLocalControls((prev) => [...prev, created]);
      setNewControl((prev) => ({
        ...prev,
        [criticActivityId]: {
          title: "",
          description: "",
        },
      }));
      setAddingControl((prev) => ({
        ...prev,
        [criticActivityId]: false,
      }));
    }
  };

  const handleUpdateControl = async (
    controlId: string,
    criticActivityId: string,
    newTitle: string,
    newDescription: string | null,
    setLocalControls: React.Dispatch<React.SetStateAction<ArtpControl[]>>,
    setEditingControl: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
  ) => {
    const trimmedTitle = newTitle?.trim();
    let trimmedDescription = newDescription?.trim();
    if (!trimmedTitle) return;
    if (!trimmedDescription) trimmedDescription = undefined;

    const updated = await updateControl({
      criticActivityId,
      id: controlId,
      title: trimmedTitle,
      description: trimmedDescription as string | undefined,
    });
    if (updated) {
      setLocalControls((prev) =>
        prev.map((c) => (c.id === controlId ? updated : c))
      );
      setEditingControl((prev) => ({
        ...prev,
        [controlId]: false,
      }));
    }
  };

  const handleDeleteControl = async (
    controlId: string,
    setLocalControls: React.Dispatch<React.SetStateAction<ArtpControl[]>>
  ) => {
    const ok = await deleteControl(controlId);
    if (ok) {
      setLocalControls((prev) => prev.filter((c) => c.id !== controlId));
    }
    return ok;
  };

  // Acciones para preguntas de verificación
  const handleAddVerificationQuestion = async (
    criticActivityId: string,
    title: string,
    description: string | null,
    setLocalVerificationQuestions: React.Dispatch<
      React.SetStateAction<ArtpVerificationQuestion[]>
    >,
    setNewVerificationQuestion: React.Dispatch<
      React.SetStateAction<{
        [key: string]: { title: string; description: string | null };
      }>
    >,
    setAddingVerificationQuestion: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
  ) => {
    const trimmedTitle = title?.trim();
    let trimmedDescription = description?.trim();
    if (!trimmedTitle) return;
    if (!trimmedDescription) trimmedDescription = undefined;

    const created = await createVerificationQuestion({
      criticActivityId,
      title: trimmedTitle,
      description: trimmedDescription as string | undefined,
    });
    if (created) {
      setLocalVerificationQuestions((prev) => [...prev, created]);
      setNewVerificationQuestion((prev) => ({
        ...prev,
        [criticActivityId]: {
          title: "",
          description: "",
        },
      }));
      setAddingVerificationQuestion((prev) => ({
        ...prev,
        [criticActivityId]: false,
      }));
    }
  };

  const handleUpdateVerificationQuestion = async (
    questionId: string,
    criticActivityId: string,
    newTitle: string,
    newDescription: string | null,
    setLocalVerificationQuestions: React.Dispatch<
      React.SetStateAction<ArtpVerificationQuestion[]>
    >,
    setEditingVerificationQuestion: React.Dispatch<
      React.SetStateAction<{ [key: string]: boolean }>
    >
  ) => {
    const trimmedTitle = newTitle?.trim();
    let trimmedDescription = newDescription?.trim();
    if (!trimmedTitle) return;
    if (!trimmedDescription) trimmedDescription = undefined;

    const updated = await updateVerificationQuestion({
      criticActivityId,
      id: questionId,
      title: trimmedTitle,
      description: trimmedDescription as string | undefined,
    });
    if (updated) {
      setLocalVerificationQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? updated : q))
      );
      setEditingVerificationQuestion((prev) => ({
        ...prev,
        [questionId]: false,
      }));
    }
  };

  const handleDeleteVerificationQuestion = async (
    questionId: string,
    setLocalVerificationQuestions: React.Dispatch<
      React.SetStateAction<ArtpVerificationQuestion[]>
    >
  ) => {
    const ok = await deleteVerificationQuestion(questionId);
    if (ok) {
      setLocalVerificationQuestions((prev) =>
        prev.filter((q) => q.id !== questionId)
      );
    }
    return ok;
  };

  return {
    // Herramientas
    handleAddTool,
    handleUpdateTool,
    handleDeleteTool,

    // Eventos no deseados
    handleAddUndesiredEvent,
    handleUpdateUndesiredEvent,
    handleDeleteUndesiredEvent,

    // Controles
    handleAddControl,
    handleUpdateControl,
    handleDeleteControl,

    // Preguntas de verificación
    handleAddVerificationQuestion,
    handleUpdateVerificationQuestion,
    handleDeleteVerificationQuestion,
  };
}
