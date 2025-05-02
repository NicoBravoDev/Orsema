// utils/ScoreCalculator.ts
import { ActivityItem, ObjectiveItem, AdditionalItem } from '../components/types/types';

/**
 * Clase para manejar todos los cálculos de puntajes de ORSEMA
 */
export class ScoreCalculator {
  /**
   * Calcula el puntaje para una actividad basado en su estado y el objetivo asociado
   * @param activity Actividad para calcular el puntaje
   * @param associatedObjective Objetivo asociado a la actividad (opcional)
   * @returns Puntaje calculado
   */
  static calculateActivityPoints(
    activity: ActivityItem,
    associatedObjective: ObjectiveItem | undefined
  ): number {
    const activityDone = activity.activityDone;
    const objectiveDone = associatedObjective ? associatedObjective.completed : false;
    const jerar = activity.jerar;
    const nivel = activity.nivel;
    const x = activity.x;
    
    // Act hecha y obj hecho = 3 pts
    if (activityDone && objectiveDone) {
      return (jerar * x * 3) + nivel;
    }
    
    // Act no hecha y obj no hecho = -4 pts
    if (!activityDone && !objectiveDone) {
      return  (jerar * x * -4) + nivel;
    }
    if(activityDone && !objectiveDone){
        return (jerar * x * 1) + nivel;
    }
    // Otros casos (act hecha pero obj no hecho, o viceversa)
    return activity.points; // Mantener el puntaje actual
  }
  
  /**
   * Verifica si se debe aumentar o disminuir X para una actividad (sin aplicar el cambio)
   * @param activity Actividad para verificar
   * @param associatedObjective Objetivo asociado a la actividad (opcional)
   * @returns { shouldDecrease: boolean, shouldIncrease: boolean } Indica si se debe aumentar o disminuir X
   */
  static checkXChange(
    activity: ActivityItem,
    associatedObjective: ObjectiveItem | undefined
  ): { shouldDecrease: boolean, shouldIncrease: boolean } {
    const activityDone = activity.activityDone;
    const objectiveDone = associatedObjective ? associatedObjective.completed : false;
    
    // Act hecha y obj hecho: -1 en X (mínimo 1)
    const shouldDecrease = activityDone && objectiveDone;
    
    // Act no hecha y obj no hecho: +1 en X
    const shouldIncrease = !activityDone && !objectiveDone;
    
    return { shouldDecrease, shouldIncrease };
  }
  
  /**
   * Aplica los cambios pendientes de X basados en el estado actual
   * @param activities Lista de actividades
   * @param objectives Lista de objetivos
   * @returns Lista de actividades actualizada con nuevos valores de X
   */
  static applyPendingXChanges(
    activities: ActivityItem[],
    objectives: ObjectiveItem[]
  ): ActivityItem[] {
    return activities.map(activity => {
      const associatedObjective = objectives.find(obj => obj.activityId === activity.id);
      const { shouldDecrease, shouldIncrease } = this.checkXChange(activity, associatedObjective);
      
      let newX = activity.x;
      
      if (shouldDecrease) {
        // Disminuir X (mínimo 1)
        newX = Math.max(1, activity.x - 1);
      } else if (shouldIncrease) {
        // Aumentar X
        newX = activity.x + 1;
      }
      
      // Si X no cambió, retornar la actividad sin cambios
      if (newX === activity.x) {
        return activity;
      }
      
      // Actualizar actividad con nuevo X
      const updatedActivity = {
        ...activity,
        x: newX
      };
      
      // Recalcular puntos con el nuevo X
      const points = this.calculateActivityPoints(updatedActivity, associatedObjective);
      
      // Retornar actividad actualizada con puntos
      return {
        ...updatedActivity,
        points
      };
    });
  }
  
  /**
   * Calcula el nuevo Sum para una actividad
   * @param activity Actividad para calcular Sum
   * @param newX Nuevo valor X calculado
   * @param hasIncompleteActivities Indica si hay actividades incompletas al día siguiente
   * @returns Nuevo valor Sum
   */
  static calculateSum(
    activity: ActivityItem,
    newX: number,
    hasIncompleteActivities: boolean
  ): number {
    // Si al día siguiente hay act no hecha, Sum = 0
    if (hasIncompleteActivities) {
      return 0;
    }
    
    // Cuando X = 1 y se logra objetivo: +1 en Sum
    if (newX === 1 && activity.activityDone) {
      return activity.sum + 1;
    }
    
    return activity.sum;
  }
  
  /**
   * Calcula el nuevo nivel basado en Sum
   * @param activity Actividad para calcular el nivel
   * @param newSum Nuevo Sum calculado
   * @returns Nuevo nivel
   */
  static calculateNivel(activity: ActivityItem, newSum: number): number {
    // Cuando Sum = 9: +1 en Nivel
    if (newSum >= 9) {
      return activity.nivel + 1;
    }
    
    return activity.nivel;
  }
  
  /**
   * Calcula el ajuste de puntos por horas de YouTube
   * @param additionalItems Lista de items adicionales
   * @returns Ajuste de puntos (negativo o cero)
   */
  static calculateYoutubeAdjustment(additionalItems: AdditionalItem[]): number {
    const youtubeItem = additionalItems.find(item => 
      item.action.toLowerCase().includes('youtube') || 
      item.action.toLowerCase().includes('yt'));
    
    if (!youtubeItem) return 0;
    
    const hours = parseFloat(youtubeItem.cant) || 0;
    
    // Horas YT diarias > 2 hrs = hrs totales*-2
    if (hours > 2) {
      return hours * -2;
    }
    
    return 0;
  }
  
  /**
   * Calcula el ajuste de puntos por proteína
   * @param additionalItems Lista de items adicionales
   * @returns Ajuste de puntos
   */
  static calculateProteinAdjustment(additionalItems: AdditionalItem[]): number {
    const proteinItem = additionalItems.find(item => 
      item.action.toLowerCase().includes('proteina') || 
      item.action.toLowerCase().includes('proteína'));
    
    if (!proteinItem) return 0;
    
    const taken = parseFloat(proteinItem.cant) > 0;
    
    // Proteina no tomada = -6pts, Tomada = 4pts
    return taken ? 4 : -6;
  }
  
  /**
   * Calcula el puntaje total logrado
   * @param activities Lista de actividades
   * @param objectives Lista de objetivos
   * @param additionalItems Lista de items adicionales
   * @returns Puntaje total logrado
   */
  static calculateTotalAchievedPoints(
    activities: ActivityItem[],
    objectives: ObjectiveItem[],
    additionalItems: AdditionalItem[]
  ): number {
    let total = 0;
    
    // Sumar puntos de actividades
    activities.forEach(activity => {
      total += activity.points;
    });
    
    // Ajustar por YouTube
    total += this.calculateYoutubeAdjustment(additionalItems);
    
    // Ajustar por proteína
    total += this.calculateProteinAdjustment(additionalItems);
    
    return total;
  }
  
  /**
   * Actualiza una actividad con todos los cálculos necesarios
   * @param activity Actividad a actualizar
   * @param associatedObjective Objetivo asociado
   * @param hasIncompleteActivities Indica si hay actividades incompletas al día siguiente
   * @returns Actividad actualizada
   */
  static updateActivity(
    activity: ActivityItem,
    associatedObjective: ObjectiveItem | undefined,
    hasIncompleteActivities: boolean = false
  ): ActivityItem {
    // Calcular puntos sin cambiar X
    const points = this.calculateActivityPoints(activity, associatedObjective);
    
    // Retornar actividad con puntos actualizados pero sin cambiar X
    return {
      ...activity,
      points
    };
  }
}