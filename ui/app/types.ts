export type Task = { name: string; complete: boolean; id: number };

export type Category = {
  name: string;
  id: number;
  tasks: Task[];
  description?: string;
};
