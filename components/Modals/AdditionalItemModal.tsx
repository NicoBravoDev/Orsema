// components/Modals/AdditionalItemModal.tsx
import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { NewAdditionalItemState } from '../types/types';
import { useTheme } from '../ThemeContext';
import { createStyles } from './Modals.styles';

interface AdditionalItemModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  newAdditionalItem: NewAdditionalItemState;
  setNewAdditionalItem: (item: NewAdditionalItemState) => void;
  handleAddAdditionalItem: () => void;
}

const AdditionalItemModal: React.FC<AdditionalItemModalProps> = ({
  showModal,
  setShowModal,
  newAdditionalItem,
  setNewAdditionalItem,
  handleAddAdditionalItem,
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
              name="document-text-outline" 
              size={24} 
              color={colors.primary} 
              style={styles.modalIcon} 
            />
            <Text style={styles.modalTitle}>Añadir Nuevo Dato</Text>
          </View>
          
          <Text style={styles.modalLabel}>Nombre</Text>
          <TextInput
            style={styles.modalInput}
            value={newAdditionalItem.action}
            onChangeText={(text) => setNewAdditionalItem({...newAdditionalItem, action: text})}
            placeholder="Ej: Horas de sueño"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.modalLabel}>Unidad</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newAdditionalItem.med}
              style={styles.picker}
              dropdownIconColor={colors.text}
              onValueChange={(value: string) => setNewAdditionalItem({...newAdditionalItem, med: value})}
            >
              <Picker.Item label="Unidades" value="Unidades" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label="Horas" value="Hrs" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label="Minutos" value="Mins" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label="Litros" value="Ltr" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label="Kilogramos" value="Kg" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label="Pasos" value="Pas" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label="Gramos" value="Grms" color={isDarkMode ? '#ffffff' : '#000000'} />
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
              onPress={handleAddAdditionalItem}
            >
              <Text style={styles.modalConfirmButtonText}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AdditionalItemModal;