// src/types/types.ts
export interface ActivityItem {
    id: number;
    name: string;
    jerar: number;
    nivel: number;
    sum: number;
    x: number;
    points: number;
    activityDone: boolean;
  }
  
  export interface ObjectiveItem {
    id: number;
    text: string;
    completed: boolean;
    activityId: number | null;
  }
  
  export interface AdditionalItem {
    id: number;
    action: string;
    cant: string;
    med: string;
  }
  
  export interface DateState {
    day: number;
    month: number;
    year: number;
  }
  
  export interface PointsState {
    arrival: number;
    achieved: number;
    total: number;
  }
  
  export interface NewActivityState {
    name: string;
    jerar: string;
  }
  
  export interface NewAdditionalItemState {
    action: string;
    med: string;
  }
  
  export interface NewObjectiveState {
    text: string;
    activityId: string;
  }