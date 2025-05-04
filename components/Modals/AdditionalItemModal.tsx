// components/Modals/AdditionalItemModal.tsx
import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { NewAdditionalItemState } from '../types/types';
import { useTheme } from '../ThemeContext';
import { createStyles } from './Modals.styles';
import { useTranslation } from 'react-i18next'; // Importar hook de traducción

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
  const { t } = useTranslation(); // Hook para traducciones

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
            <Text style={styles.modalTitle}>{t('modals.additionalItem.title')}</Text>
          </View>
          
          <Text style={styles.modalLabel}>{t('modals.additionalItem.action')}</Text>
          <TextInput
            style={styles.modalInput}
            value={newAdditionalItem.action}
            onChangeText={(text) => setNewAdditionalItem({...newAdditionalItem, action: text})}
            placeholder="Ej: Horas de sueño"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.modalLabel}>{t('modals.additionalItem.measure')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newAdditionalItem.med}
              style={styles.picker}
              dropdownIconColor={colors.text}
              onValueChange={(value: string) => setNewAdditionalItem({...newAdditionalItem, med: value})}
            >
              {/* Mantenemos los valores constantes (Unidades, Hrs, etc.) 
                  pero mostramos etiquetas traducidas */}
              <Picker.Item label={t('measures.units')} value="Unidades" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label={t('measures.hours')} value="Hrs" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label={t('measures.minutes')} value="Mins" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label={t('measures.liters')} value="Ltr" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label={t('measures.kilograms')} value="Kg" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label={t('measures.steps')} value="Pas" color={isDarkMode ? '#ffffff' : '#000000'} />
              <Picker.Item label={t('measures.grams')} value="Grms" color={isDarkMode ? '#ffffff' : '#000000'} />
            </Picker>
          </View>
          
          <View style={styles.modalButtonRow}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>{t('modals.additionalItem.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalConfirmButton}
              onPress={handleAddAdditionalItem}
            >
              <Text style={styles.modalConfirmButtonText}>{t('modals.additionalItem.add')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AdditionalItemModal;