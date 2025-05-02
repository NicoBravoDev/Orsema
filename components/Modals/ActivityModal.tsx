// components/Modals/ActivityModal.tsx
import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewActivityState } from '../types/types';
import { useTheme } from '../ThemeContext';
import { createStyles } from './Modals.styles';

interface ActivityModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  newActivity: NewActivityState;
  setNewActivity: (activity: NewActivityState) => void;
  handleAddActivity: () => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  showModal,
  setShowModal,
  newActivity,
  setNewActivity,
  handleAddActivity,
}) => {
  const { colors } = useTheme();
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
              name="fitness-outline" 
              size={24} 
              color={colors.primary} 
              style={styles.modalIcon} 
            />
            <Text style={styles.modalTitle}>Añadir Nueva Actividad</Text>
          </View>
          
          <Text style={styles.modalLabel}>Nombre</Text>
          <TextInput
            style={styles.modalInput}
            value={newActivity.name}
            onChangeText={(text) => setNewActivity({...newActivity, name: text})}
            placeholder="Ej: Meditación"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.modalLabel}>Jerarquía (1-10)</Text>
          <TextInput
            style={styles.modalInput}
            value={newActivity.jerar}
            onChangeText={(text) => setNewActivity({...newActivity, jerar: text})}
            keyboardType="numeric"
            placeholder="Importancia de 1 a 10"
            placeholderTextColor={colors.textSecondary}
          />
          
          <View style={styles.modalButtonRow}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalConfirmButton}
              onPress={handleAddActivity}
            >
              <Text style={styles.modalConfirmButtonText}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ActivityModal;