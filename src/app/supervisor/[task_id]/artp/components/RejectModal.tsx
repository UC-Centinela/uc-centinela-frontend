import React, { useEffect, useRef } from "react";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => Promise<boolean>;
  loading: boolean;
  error: string;
  comment: string;
  setComment: (value: string) => void;
  taskId: string;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  error,
  comment,
  setComment,
  taskId,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { push: pushWithLoading } = useRouterLoading();

  useEffect(() => {
    if (!isOpen) {
      setComment("");
    }
  }, [isOpen, setComment]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onConfirm(comment);
    if (success) {
      setTimeout(() => {
        pushWithLoading(`/supervisor/${taskId}/artp/rejected`);
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-red-700">
            ¿Estás seguro que deseas rechazar la tarea?
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={loading}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
          <div>
            <label htmlFor="reject-comment" className="block text-sm font-medium text-gray-700 mb-1">
              Debes dejar un comentario explicando detalladamente el motivo del rechazo.
            </label>
            <Textarea
              id="reject-comment"
              name="reject-comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Explica el motivo del rechazo..."
              rows={4}
              required
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Rechazando...
                </div>
              ) : (
                "Confirmar rechazo"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectModal;
