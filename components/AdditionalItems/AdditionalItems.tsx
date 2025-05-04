// components/AdditionalItems/AdditionalItems.tsx
import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { AdditionalItem } from '../types/types';
import { useTheme } from '../ThemeContext';
import { createStyles } from './AdditionalItems.styles';
import { ScoreCalculator } from '../../utils/ScoreCalculator'; // Importar el calculador
import { useTranslation } from 'react-i18next'; // Importar hook de traducción

interface AdditionalItemsProps {
  additionalItems: AdditionalItem[];
  updateAdditionalItem: (id: number, field: string, value: any) => void;
  removeAdditionalItem: (id: number) => void;
  setShowAdditionalItemModal: (show: boolean) => void;
  updateTotalPoints: (adjustment: number) => void; // Para actualizar los puntos totales
}

const AdditionalItems: React.FC<AdditionalItemsProps> = ({
  additionalItems,
  updateAdditionalItem,
  removeAdditionalItem,
  setShowAdditionalItemModal,
  updateTotalPoints,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation(); // Hook para traducciones

  // Calculamos los ajustes cuando cambian los items adicionales
  useEffect(() => {
    // Calcular ajustes por YouTube
    const youtubeAdjustment = ScoreCalculator.calculateYoutubeAdjustment(additionalItems);
    
    // Calcular ajustes por proteína
    const proteinAdjustment = ScoreCalculator.calculateProteinAdjustment(additionalItems);
    
    // Actualizar puntos totales con los ajustes
    updateTotalPoints(youtubeAdjustment + proteinAdjustment);
  }, [additionalItems, updateTotalPoints]);

  // Función para manejar cambios en cantidad
  const handleCantChange = (id: number, value: string) => {
    // Actualizar el item
    updateAdditionalItem(id, 'cant', value);
    
    // Los cálculos se hacen en el useEffect
  };

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('additionalItems.title')}</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowAdditionalItemModal(true)}
        >
          <Ionicons name="add-circle-outline" size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>{t('additionalItems.addItem')}</Text>
        </TouchableOpacity>
      </View>
      
      {additionalItems.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>
            {t('additionalItems.emptyState')}
          </Text>
        </View>
      ) : (
        <>
          {/* Encabezados de la tabla de datos adicionales */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>{t('additionalItems.action')}</Text>
            <Text style={styles.tableHeaderCell}>{t('additionalItems.quantity')}</Text>
            <Text style={styles.tableHeaderCell}>{t('additionalItems.measure')}</Text>
            <Text style={{ width: 36 }}></Text>
          </View>
          
          {/* Filas de datos adicionales */}
          {additionalItems.map(item => {
            // Determinar si este item afecta los puntos (YouTube o proteína)
            const isYoutube = item.action.toLowerCase().includes('youtube') || 
                             item.action.toLowerCase().includes('yt');
            const isProtein = item.action.toLowerCase().includes('proteina') || 
                             item.action.toLowerCase().includes('proteína');
            
            // Calcular el ajuste para este item específico
            let itemAdjustment = 0;
            if (isYoutube) {
              const hours = parseFloat(item.cant) || 0;
              if (hours > 2) {
                itemAdjustment = hours * -2;
              }
            } else if (isProtein) {
              const taken = parseFloat(item.cant) > 0;
              itemAdjustment = taken ? 4 : -6;
            }
            
            return (
              <View key={item.id} style={styles.tableRow}>
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <TextInput
                    style={styles.tableCellInput}
                    value={item.action}
                    onChangeText={(text) => updateAdditionalItem(item.id, 'action', text)}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                <View style={styles.tableCell}>
                  <TextInput
                    style={[
                      styles.tableCellInput,
                      (isYoutube || isProtein) && styles.highlightedInput
                    ]}
                    value={item.cant}
                    onChangeText={(text) => handleCantChange(item.id, text)}
                    keyboardType="numeric"
                    placeholderTextColor={colors.textSecondary}
                    placeholder="0"
                  />
                </View>
                <View style={styles.tableCell}>
                  <TextInput
                    style={styles.tableCellInput}
                    value={item.med}
                    onChangeText={(text) => updateAdditionalItem(item.id, 'med', text)}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>
                {/* Mostrar el ajuste de puntos si es YouTube o proteína */}
                {(isYoutube || isProtein) && (
                  <View style={styles.adjustmentContainer}>
                    <Text style={[
                      styles.adjustmentText,
                      itemAdjustment >= 0 ? styles.positiveAdjustment : styles.negativeAdjustment
                    ]}>
                      {itemAdjustment >= 0 ? '+' : ''}{itemAdjustment}
                    </Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => removeAdditionalItem(item.id)}
                >
                  <FontAwesome5 name="trash-alt" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            );
          })}
          
          {/* Mensaje informativo sobre reglas */}
          <View style={styles.infoContainer}>
            <FontAwesome5 name="info-circle" size={16} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>
              {t('additionalItems.infoMessage')}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default AdditionalItems;