import { TaskState } from "./task"

export interface TaskFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  assignedTo?: number;
  createdBy?: number;
  state?: TaskState[];
} 