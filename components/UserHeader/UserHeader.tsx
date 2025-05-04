// components/UserHeader/UserHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../ThemeContext';
import { useTranslation } from 'react-i18next';

interface UserHeaderProps {
  username: string;
  email: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ username, email }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  // Iniciales del usuario para el avatar
  const getUserInitials = () => {
    if (!username) return 'U';
    return username.charAt(0).toUpperCase();
  };

  // Estilos dinámicos basados en el tema
  const styles = StyleSheet.create({
    headerContainer: {
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      // Hacer que el encabezado sea fijo en la parte superior
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      // Sombra para destacar el header
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#444444' : '#DDDDDD',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: isDarkMode ? '#FFFFFF' : '#444444',
      fontSize: 20,
      fontWeight: 'bold',
    },
    userInfoContainer: {
      flex: 1,
    },
    username: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    email: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    menuButton: {
      padding: 8,
    },
    menuIcon: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{getUserInitials()}</Text>
      </View>
      
      <View style={styles.userInfoContainer}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      
      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuIcon}>•••</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserHeader;