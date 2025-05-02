// components/Modals/ObjectiveModal.tsx
import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { NewObjectiveState, ActivityItem } from '../types/types';
import { useTheme } from '../ThemeContext';
import { createStyles } from './Modals.styles';

interface ObjectiveModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  newObjective: NewObjectiveState;
  setNewObjective: (objective: NewObjectiveState) => void;
  handleAddObjective: () => void;
  activities: ActivityItem[];
}

const ObjectiveModal: React.FC<ObjectiveModalProps> = ({
  showModal,
  setShowModal,
  newObjective,
  setNewObjective,
  handleAddObjective,
  activities,
}) => {
  const { isDarkMode, colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons 
              name="flag-outline" 
              size={24} 
              color={colors.primary} 
              style={styles.modalIcon} 
            />
            <Text style={styles.modalTitle}>Añadir Nuevo Objetivo</Text>
          </View>
          
          <Text style={styles.modalLabel}>Descripción</Text>
          <TextInput
            style={styles.modalInput}
            value={newObjective.text}
            onChangeText={(text) => setNewObjective({...newObjective, text: text})}
            placeholder="Ej: Meditar 15 minutos"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.modalLabel}>Actividad</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newObjective.activityId}
              style={styles.picker}
              dropdownIconColor={colors.text}
              onValueChange={(value: string) => setNewObjective({...newObjective, activityId: value})}
            >
              <Picker.Item label="Sin relacionar" value="" color={isDarkMode ? '#ffffff' : '#000000'} />
              {activities.map(activity => (
                <Picker.Item 
                  key={activity.id} 
                  label={activity.name} 
                  value={activity.id.toString()} 
                  color={isDarkMode ? '#ffffff' : '#000000'}
                />
              ))}
            </Picker>
          </View>
          
          <View style={styles.modalButtonRow}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalConfirmButton}
              onPress={handleAddObjective}
            >
              <Text style={styles.modalConfirmButtonText}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ObjectiveModal;