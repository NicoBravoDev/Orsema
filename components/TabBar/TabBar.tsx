// components/TabBar/TabBar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { useTranslation } from 'react-i18next';

export type TabName = 'home' | 'stats' | 'calendar' | 'settings';

interface TabBarProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

// Definimos explícitamente los iconos para evitar errores de TypeScript
interface TabInfo {
  name: TabName;
  activeIcon: any; // Cualquier tipo de icono válido de Ionicons
  inactiveIcon: any; // Cualquier tipo de icono válido de Ionicons
  label: string;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  // Creamos estilos dinámicos basados en el tema
  const localStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333333' : '#DDDDDD',
      height: 60,
      paddingBottom: 4, // Para dispositivos con safe area
    },
    tabItem: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    activeTab: {
      borderTopWidth: 2,
      borderTopColor: colors.primary,
    },
    tabText: {
      fontSize: 12,
      marginTop: 2,
      color: colors.text,
    },
    activeTabText: {
      color: colors.primary,
      fontWeight: 'bold',
    }
  });
  
  // Obtenemos el nombre de los tabs de las traducciones
  const getTabInfo = (): TabInfo[] => [
    { 
      name: 'home', 
      activeIcon: 'home', 
      inactiveIcon: 'home-outline', 
      label: t('tabBar.home') 
    },
    { 
      name: 'stats', 
      activeIcon: 'stats-chart', 
      inactiveIcon: 'stats-chart-outline', 
      label: t('tabBar.stats') 
    },
    { 
      name: 'calendar', 
      activeIcon: 'calendar', 
      inactiveIcon: 'calendar-outline', 
      label: t('tabBar.calendar') 
    },
    { 
      name: 'settings', 
      activeIcon: 'settings', 
      inactiveIcon: 'settings-outline', 
      label: t('tabBar.settings') 
    }
  ];
  
  const tabs = getTabInfo();
  
  return (
    <View style={localStyles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              localStyles.tabItem,
              isActive && localStyles.activeTab
            ]}
            onPress={() => onTabChange(tab.name)}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.inactiveIcon}
              size={22}
              color={isActive ? colors.primary : colors.text}
            />
            <Text
              style={[
                localStyles.tabText,
                isActive && localStyles.activeTabText
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;