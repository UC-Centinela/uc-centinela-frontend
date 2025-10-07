// Declaración global para evitar conflictos de tipos
declare global {
  // Asegurar que FormData se refiera al tipo nativo del DOM
  interface FormData {
    append(name: string, value: string | Blob, fileName?: string): void;
    delete(name: string): void;
    get(name: string): FormDataEntryValue | null;
    getAll(name: string): FormDataEntryValue[];
    has(name: string): boolean;
    set(name: string, value: string | Blob, fileName?: string): void;
  }
}

export {};
