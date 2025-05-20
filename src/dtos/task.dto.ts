export interface TaskDto {
    id: string;
    title: string;
    instruction: string;
    state: string;
    creatorUserId: string;
    revisorUserId: string;
    comments: string;
    changeHistory: string;
    assignationDate: string;
    requiredSendDate: string;
}