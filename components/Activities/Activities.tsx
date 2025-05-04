// components/Activities/Activities.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ActivityItem, ObjectiveItem } from '../types/types';
import { useTheme } from '../ThemeContext';
import { createStyles } from './Activities.styles';
import { ScoreCalculator } from '../../utils/ScoreCalculator'; // Importar el calculador desde la carpeta utils
import { useTranslation } from 'react-i18next'; // Importar hook de traducción

interface ActivitiesProps {
  activities: ActivityItem[];
  objectives: ObjectiveItem[];
  updateActivity: (id: number, field: string, value: any) => void;
  setActivities: (activities: ActivityItem[]) => void; // Para actualizar toda la lista
  removeActivity: (id: number) => void;
  toggleObjective: (id: number) => void;
  setShowActivityModal: (show: boolean) => void;
}

const Activities: React.FC<ActivitiesProps> = ({
  activities,
  objectives,
  updateActivity,
  setActivities,
  removeActivity,
  toggleObjective,
  setShowActivityModal,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation(); // Hook para traducciones

  // Función que utiliza el ScoreCalculator para actualizar actividades
  const handleActivityToggle = (activity: ActivityItem, newValue: boolean) => {
    // Primero actualizamos visualmente el estado para UI más receptiva
    updateActivity(activity.id, 'activityDone', newValue);
    
    // Obtenemos el objetivo asociado
    const associatedObjective = objectives.find(obj => obj.activityId === activity.id);
    
    // Creamos una copia de la actividad con el nuevo estado
    const updatedActivity = {
      ...activity,
      activityDone: newValue
    };
    
    // Usamos el ScoreCalculator para actualizar todos los valores según las reglas
    const fullyUpdatedActivity = ScoreCalculator.updateActivity(
      updatedActivity, 
      associatedObjective
    );
    
    // Actualizamos la actividad completa en el estado
    setActivities(
      activities.map(act => act.id === activity.id ? fullyUpdatedActivity : act)
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('activities.title')}</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowActivityModal(true)}
        >
          <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>{t('activities.addActivity')}</Text>
        </TouchableOpacity>
      </View>
      
      {activities.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="list-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>
            {t('activities.emptyState')}
          </Text>
        </View>
      ) : (
        <>
          {/* Encabezados de la tabla de actividades */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t('activities.activity')}</Text>
            <Text style={styles.tableHeaderCell}>{t('activities.done')}</Text>
            <Text style={styles.tableHeaderCell}>{t('activities.factor')}</Text>
            <Text style={styles.tableHeaderCell}>{t('activities.points')}</Text>
            <Text style={{ width: 36 }}></Text>
          </View>
          
          {/* Filas de actividades */}
          {activities.map(activity => {
            const associatedObjective = objectives.find(obj => obj.activityId === activity.id);
            return (
              <View key={activity.id} style={styles.tableRow}>
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <TextInput
                    style={styles.tableCellInput}
                    value={activity.name}
                    onChangeText={(text) => updateActivity(activity.id, 'name', text)}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                <View style={styles.tableCell}>
                  <Switch
                    value={activity.activityDone || false}
                    onValueChange={(value) => handleActivityToggle(activity, value)}
                    trackColor={{ 
                      false: colors.inputBg, 
                      true: `${colors.success}80` 
                    }}
                    thumbColor={activity.activityDone ? colors.success : colors.card}
                  />
                </View>
                <View style={styles.tableCell}>
                  <View style={[styles.tableCellInput, styles.readOnlyInput, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>{activity.x}</Text>
                  </View>
                </View>
                <View style={styles.tableCell}>
                  <View 
                    style={[
                      styles.tableCellInput, 
                      styles.readOnlyInput, 
                      { justifyContent: 'center', alignItems: 'center' }
                    ]}
                  >
                    <Text 
                      style={[
                        { fontWeight: 'bold' },
                        activity.points >= 0 ? styles.pointsPositive : styles.pointsNegative
                      ]}
                    >
                      {activity.points}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => removeActivity(activity.id)}
                >
                  <FontAwesome5 name="trash-alt" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            );
          })}
        </>
      )}
    </View>
  );
};

export default Activities;