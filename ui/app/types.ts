export type Task = { name: string; complete: boolean; id: number };

export type Trip = { id: number; name: string; startDate: string };

export type Category = {
  name: string;
  id: number;
  tasks: Task[];
  description?: string;
  trip: Trip;
  uncompletedTasks: Task[];
  completedTasks: Task[];
};

declare global {
  interface Window {
    ENV: { PUBLIC_API_URL: string };
  }
}
