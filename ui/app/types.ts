export type Task = { name: string; complete: boolean; id: string };

export type Category = {
  name: string;
  id: string;
  tasks: Task[];
};
