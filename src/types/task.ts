export type TaskState = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REVIEWED" | "IS_REJECTED";

export interface Task {
    id: string;
    title: string;
    assignationDate: string;
    requiredSendDate: string;
    state: TaskState;
    creatorUserId: number;
    changeHistory: TaskHistoryItem[];
    comments: string;
    instruction: string;
    revisorUserId: number;
}

export interface TaskComment {
    id: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskHistoryItem {
    id: string;
    action: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskStatusData {
    status: TaskState[];
    label: string;
    count: number;
    color: string;
}

export interface TaskFilters {
    state?: TaskState[];
    assignedTo?: number;
    createdBy?: number;
    dateRange?: {
        start: Date;
        end: Date;
    };
} 

export interface CriticActivity {
    id: number;
    title: string;
    taskId: number;
}

export interface Tools {
    id: number;
    criticActivityId: number;
    title: string;
}

export interface UndesiredEvent {
    id: number;
    criticActivityId: number;
    title: string;
    description?: string | null;
}

export interface Control {
    id: number;
    criticActivityId: number;
    title: string;
    description?: string | null;
}

export interface VerificationQuestion {
    id: number;
    criticActivityId: number;
    title: string;
    description?: string | null;
}

export interface ArtpData {
    criticActivities: CriticActivity[];
    tools?: Tools[];
    undesiredEvents?: UndesiredEvent[];
    controls?: Control[];
    verificationQuestions?: VerificationQuestion[];
}