// components/Objectives/Objectives.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ObjectiveItem, ActivityItem } from '../types/types';
import { useTheme } from '../ThemeContext';
import { createStyles } from './Objectives.styles';
import { ScoreCalculator } from '../../utils/ScoreCalculator'; // Importar el calculador

interface ObjectivesProps {
  objectives: ObjectiveItem[];
  activities: ActivityItem[];
  toggleObjective: (id: number) => void;
  updateObjectiveText: (id: number, text: string) => void;
  removeObjective: (id: number) => void;
  setObjectiveActivity: (objId: number, actId: string) => void;
  setShowObjectiveModal: (show: boolean) => void;
  setActivities: (activities: ActivityItem[]) => void; // Añadido para poder actualizar actividades
  updateActivity: (id: number, field: string, value: any) => void; // Añadido para actualizar el estado de actividades
}

const Objectives: React.FC<ObjectivesProps> = ({
  objectives,
  activities,
  toggleObjective,
  updateObjectiveText,
  removeObjective,
  setObjectiveActivity,
  setShowObjectiveModal,
  setActivities,
  updateActivity, // Nueva prop para actualizar actividades
}) => {
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(colors);

  // Función mejorada para manejar el toggle de objetivos usando ScoreCalculator
  // y actualizando automáticamente la actividad asociada
  const handleObjectiveToggle = (objective: ObjectiveItem) => {
    // Primero actualizamos el estado del objetivo para UI más receptiva
    toggleObjective(objective.id);
    
    // Si el objetivo está asociado a una actividad, actualizamos la actividad
    if (objective.activityId !== null) {
      const activity = activities.find(act => act.id === objective.activityId);
      if (activity) {
        // Crear una copia del objetivo con el estado invertido
        const updatedObjective = {
          ...objective,
          completed: !objective.completed
        };
        
        // Marcar automáticamente la actividad como completada si el objetivo está completado
        if (!objective.completed) { // Si está pasando de no completado a completado
          // Actualizar el estado de actividad a completado
          updateActivity(activity.id, 'activityDone', true);
          
          // Usar ScoreCalculator para actualizar los puntos de la actividad
          // Nota: La actividad ya tiene el nuevo estado de activityDone=true
          const updatedActivity = ScoreCalculator.updateActivity(
            {...activity, activityDone: true}, 
            updatedObjective
          );
          
          // Actualizar la actividad en el estado
          setActivities(
            activities.map(act => act.id === activity.id ? updatedActivity : act)
          );
        } else {
          // Si está desmarcando el objetivo, solo actualizamos los puntos
          // pero no cambiamos el estado de la actividad
          const updatedActivity = ScoreCalculator.updateActivity(activity, updatedObjective);
          
          // Actualizar la actividad en el estado
          setActivities(
            activities.map(act => act.id === activity.id ? updatedActivity : act)
          );
        }
      }
    }
  };

  // Función mejorada para cambiar la actividad asociada usando ScoreCalculator
  const handleActivityChange = (objId: number, actId: string) => {
    // Primero actualizamos el objetivo
    setObjectiveActivity(objId, actId);
    
    if (actId) {
      // Obtener el objetivo y la actividad
      const objective = objectives.find(obj => obj.id === objId);
      const activity = activities.find(act => act.id === parseInt(actId));
      
      if (objective && activity) {
        // Si el objetivo está completado, marcar automáticamente la actividad
        if (objective.completed) {
          // Actualizar el estado de actividad a completado
          updateActivity(activity.id, 'activityDone', true);
          
          // Usar ScoreCalculator para actualizar los puntos de la actividad
          const updatedActivity = ScoreCalculator.updateActivity(
            {...activity, activityDone: true}, 
            objective
          );
          
          // Actualizar la actividad en el estado
          setActivities(
            activities.map(act => act.id === activity.id ? updatedActivity : act)
          );
        } else {
          // Si el objetivo no está completado, solo actualizamos la relación
          const updatedActivity = ScoreCalculator.updateActivity(activity, objective);
          
          // Actualizar la actividad en el estado
          setActivities(
            activities.map(act => act.id === activity.id ? updatedActivity : act)
          );
        }
      }
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Objetivos</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowObjectiveModal(true)}
        >
          <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>
      
      {objectives.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="flag-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>
            No tienes objetivos establecidos. Define objetivos claros para medir tu progreso.
          </Text>
        </View>
      ) : (
        /* Lista de objetivos */
        objectives.map(obj => {
          const associatedActivity = activities.find(act => act.id === obj.activityId);
          return (
            <View key={obj.id} style={styles.objectiveItem}>
              <View style={styles.objectiveRow}>
                <Switch
                  value={obj.completed}
                  onValueChange={() => handleObjectiveToggle(obj)}
                  trackColor={{ 
                    false: colors.inputBg, 
                    true: `${colors.success}80` 
                  }}
                  thumbColor={obj.completed ? colors.success : colors.card}
                />
                <TextInput
                  style={[
                    styles.objectiveInput,
                    obj.completed && styles.completedObjective
                  ]}
                  value={obj.text}
                  onChangeText={(text) => updateObjectiveText(obj.id, text)}
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity 
                  style={styles.deleteRoundButton}
                  onPress={() => removeObjective(obj.id)}
                >
                  <FontAwesome5 name="trash-alt" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.objectiveAssociation}>
                <Text style={styles.objectiveAssociationLabel}>Actividad:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={obj.activityId ? obj.activityId.toString() : ''}
                    style={styles.picker}
                    dropdownIconColor={colors.text}
                    onValueChange={(value) => handleActivityChange(obj.id, value)}
                  >
                    <Picker.Item label="Sin asignar" value="" color={isDarkMode ? '#ffffff' : '#000000'} />
                    {activities.map(act => (
                      <Picker.Item 
                        key={act.id} 
                        label={act.name} 
                        value={act.id.toString()} 
                        color={isDarkMode ? '#ffffff' : '#000000'} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              
              {associatedActivity && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome5 name="link" size={12} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.associatedActivityText}>
                    Asociado a: {associatedActivity.name}
                  </Text>
                  <Text style={{
                    marginLeft: 8,
                    color: associatedActivity.activityDone ? colors.success : colors.textSecondary,
                    fontSize: 12
                  }}>
                    {associatedActivity.activityDone ? "(Completada)" : "(Pendiente)"}
                  </Text>
                </View>
              )}
              
              <View 
                style={[
                  styles.objectiveStatusBadge,
                  obj.completed ? styles.completedBadge : styles.pendingBadge
                ]}
              >
                <FontAwesome5 
                  name={obj.completed ? "check-circle" : "clock"} 
                  size={12} 
                  color="#FFFFFF" 
                />
                <Text style={styles.objectiveStatusText}>
                  {obj.completed ? "Completado" : "Pendiente"}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
};

export default Objectives;