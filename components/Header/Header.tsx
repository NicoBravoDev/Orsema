// components/Header/Header.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DateState, PointsState } from '../types/types';
import { useTheme } from '../ThemeContext';
import { createStyles } from './Header.styles';

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
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const styles = createStyles(colors);

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
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.title}>ORSEMA</Text>
          <View style={styles.themeSwitchContainer}>
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={22} 
              color={colors.text} 
              style={styles.themeIcon} 
            />
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: `${colors.primary}80` }}
              thumbColor={isDarkMode ? colors.primary : '#FFFFFF'}
            />
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>PREMIUM</Text>
          </View>
          <Text style={styles.subtitle}>
            Sistema avanzado de seguimiento de hábitos
          </Text>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={saveToFirebase}
          >
            <Ionicons name="save-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buttonSecondary} 
            onPress={resetData}
          >
            <Ionicons name="refresh-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Fecha y puntos */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Fecha y Puntos</Text>
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Día</Text>
            <TextInput
              style={styles.dateInput}
              value={date.day.toString()}
              onChangeText={(text) => setDate({...date, day: text ? parseInt(text) : 0})}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Mes</Text>
            <TextInput
              style={styles.dateInput}
              value={date.month.toString()}
              onChangeText={(text) => setDate({...date, month: text ? parseInt(text) : 0})}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Año</Text>
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
          <Text style={styles.todayButtonText}>Hoy</Text>
        </TouchableOpacity>
        
        <View style={styles.pointsContainer}>
          <View style={styles.pointsItem}>
            <Text style={styles.pointsLabel}>Pts. Llegada</Text>
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
            <Text style={styles.pointsLabel}>Pts. Logrado</Text>
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
            <Text style={styles.pointsLabel}>Pts. Total</Text>
            <TextInput
              style={[styles.pointsInput, styles.readOnlyInput]}
              value={points.total.toString()}
              editable={false}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default Header;