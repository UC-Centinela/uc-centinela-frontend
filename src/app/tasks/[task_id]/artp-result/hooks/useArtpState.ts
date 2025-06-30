import { useState } from "react";
import { GenerateArtpResponse } from "@/services/artp";

export function useArtpState(artpData: GenerateArtpResponse) {
  // Estado para herramientas
  const [addingTool, setAddingTool] = useState<{
    [criticActivityId: string]: boolean;
  }>({});
  const [newToolTitle, setNewToolTitle] = useState<{
    [criticActivityId: string]: string;
  }>({});
  const [localTools, setLocalTools] = useState(artpData.tools);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    toolId?: string;
    toolName?: string;
  }>({ open: false });
  const [editingTool, setEditingTool] = useState<{ [toolId: string]: boolean }>(
    {}
  );
  const [editToolTitle, setEditToolTitle] = useState<{
    [toolId: string]: string;
  }>({});

  // Estado para eventos no deseados
  const [addingUndesiredEvent, setAddingUndesiredEvent] = useState<{
    [criticActivityId: string]: boolean;
  }>({});
  const [newUndesiredEvent, setNewUndesiredEvent] = useState<{
    [criticActivityId: string]: { title: string; description: string | null };
  }>({});
  const [localUndesiredEvents, setLocalUndesiredEvents] = useState(
    artpData.undesiredEvents
  );
  const [editingUndesiredEvent, setEditingUndesiredEvent] = useState<{
    [eventId: string]: boolean;
  }>({});
  const [editUndesiredEvent, setEditUndesiredEvent] = useState<{
    [eventId: string]: { title: string; description: string | null };
  }>({});
  const [deleteUndesiredEventDialog, setDeleteUndesiredEventDialog] = useState<{
    open: boolean;
    eventId?: string;
    eventTitle?: string;
  }>({ open: false });

  // Estado para controles
  const [addingControl, setAddingControl] = useState<{
    [criticActivityId: string]: boolean;
  }>({});
  const [newControl, setNewControl] = useState<{
    [criticActivityId: string]: { title: string; description: string | null };
  }>({});
  const [localControls, setLocalControls] = useState(artpData.controls);
  const [editingControl, setEditingControl] = useState<{
    [controlId: string]: boolean;
  }>({});
  const [editControl, setEditControl] = useState<{
    [controlId: string]: { title: string; description: string | null };
  }>({});
  const [deleteControlDialog, setDeleteControlDialog] = useState<{
    open: boolean;
    controlId?: string;
    controlTitle?: string;
  }>({ open: false });

  // Estado para preguntas de verificación
  const [addingVerificationQuestion, setAddingVerificationQuestion] = useState<{
    [criticActivityId: string]: boolean;
  }>({});
  const [newVerificationQuestion, setNewVerificationQuestion] = useState<{
    [criticActivityId: string]: { title: string; description: string | null };
  }>({});
  const [localVerificationQuestions, setLocalVerificationQuestions] = useState(
    artpData.verificationQuestions
  );
  const [editingVerificationQuestion, setEditingVerificationQuestion] =
    useState<{ [questionId: string]: boolean }>({});
  const [editVerificationQuestion, setEditVerificationQuestion] = useState<{
    [questionId: string]: { title: string; description: string | null };
  }>({});
  const [
    deleteVerificationQuestionDialog,
    setDeleteVerificationQuestionDialog,
  ] = useState<{
    open: boolean;
    questionId?: string;
    questionTitle?: string;
  }>({ open: false });

  return {
    // Herramientas
    addingTool,
    setAddingTool,
    newToolTitle,
    setNewToolTitle,
    localTools,
    setLocalTools,
    deleteDialog,
    setDeleteDialog,
    editingTool,
    setEditingTool,
    editToolTitle,
    setEditToolTitle,

    // Eventos no deseados
    addingUndesiredEvent,
    setAddingUndesiredEvent,
    newUndesiredEvent,
    setNewUndesiredEvent,
    localUndesiredEvents,
    setLocalUndesiredEvents,
    editingUndesiredEvent,
    setEditingUndesiredEvent,
    editUndesiredEvent,
    setEditUndesiredEvent,
    deleteUndesiredEventDialog,
    setDeleteUndesiredEventDialog,

    // Controles
    addingControl,
    setAddingControl,
    newControl,
    setNewControl,
    localControls,
    setLocalControls,
    editingControl,
    setEditingControl,
    editControl,
    setEditControl,
    deleteControlDialog,
    setDeleteControlDialog,

    // Preguntas de verificación
    addingVerificationQuestion,
    setAddingVerificationQuestion,
    newVerificationQuestion,
    setNewVerificationQuestion,
    localVerificationQuestions,
    setLocalVerificationQuestions,
    editingVerificationQuestion,
    setEditingVerificationQuestion,
    editVerificationQuestion,
    setEditVerificationQuestion,
    deleteVerificationQuestionDialog,
    setDeleteVerificationQuestionDialog,
  };
}
