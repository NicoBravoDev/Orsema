// components/Header/Header.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DateState, PointsState } from '../types/types';
import { useTheme } from '../ThemeContext';
import { createStyles } from './Header.styles';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  date: DateState;
  points: PointsState;
  setDate: (date: DateState) => void;
  setPoints: (points: PointsState) => void;
  saveToFirebase: () => void;
  resetData: () => void;
}

const Header: React.FC<HeaderProps> = ({
  date,
  points,
  setDate,
  setPoints,
  saveToFirebase,
  resetData,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const setToday = () => {
    const today = new Date();
    setDate({
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear() % 100,
    });
  };

  return (
    <>
      {/* Fecha y puntos */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('header.dateAndPoints')}</Text>
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>{t('header.day')}</Text>
            <TextInput
              style={styles.dateInput}
              value={date.day.toString()}
              onChangeText={(text) => setDate({...date, day: text ? parseInt(text) : 0})}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>{t('header.month')}</Text>
            <TextInput
              style={styles.dateInput}
              value={date.month.toString()}
              onChangeText={(text) => setDate({...date, month: text ? parseInt(text) : 0})}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>{t('header.year')}</Text>
            <TextInput
              style={styles.dateInput}
              value={date.year.toString()}
              onChangeText={(text) => setDate({...date, year: text ? parseInt(text) : 0})}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.todayButton} onPress={setToday}>
          <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
          <Text style={styles.todayButtonText}>{t('header.today')}</Text>
        </TouchableOpacity>
        
        <View style={styles.pointsContainer}>
          <View style={styles.pointsItem}>
            <Text style={styles.pointsLabel}>{t('header.arrivalPoints')}</Text>
            <TextInput
              style={styles.pointsInput}
              value={points.arrival.toString()}
              onChangeText={(text) => {
                const newArrival = text ? parseInt(text) : 0;
                setPoints({
                  ...points, 
                  arrival: newArrival, 
                  total: newArrival + points.achieved
                });
              }}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.pointsItem}>
            <Text style={styles.pointsLabel}>{t('header.achievedPoints')}</Text>
            <TextInput
              style={styles.pointsInput}
              value={points.achieved.toString()}
              onChangeText={(text) => {
                const newAchieved = text ? parseInt(text) : 0;
                setPoints({
                  ...points, 
                  achieved: newAchieved, 
                  total: points.arrival + newAchieved
                });
              }}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.pointsItem}>
            <Text style={styles.pointsLabel}>{t('header.totalPoints')}</Text>
            <TextInput
              style={[styles.pointsInput, styles.readOnlyInput]}
              value={points.total.toString()}
              editable={false}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
        
        {/* Botones de acción */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={saveToFirebase}
          >
            <Ionicons name="save-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t('header.save')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonSecondary} 
            onPress={resetData}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>{t('header.reset')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Header;