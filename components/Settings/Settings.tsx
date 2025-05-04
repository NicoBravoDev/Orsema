// components/Settings/Settings.tsx
import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { t, i18n } = useTranslation();
  
  const currentLanguage = i18n.language;

  // Función para cambiar el idioma
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    AsyncStorage.setItem('selectedLanguage', language);
  };

  // Crear estilos basados en el tema
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      marginBottom: 24,
      backgroundColor: colors.card,
      borderRadius: 8,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    itemText: {
      fontSize: 16,
      color: colors.text,
    },
    iconContainer: {
      width: 32,
      alignItems: 'center',
      marginRight: 12,
    },
    itemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    languageButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
      marginLeft: 8,
    },
    activeLanguage: {
      backgroundColor: colors.primary,
    },
    languageButtonText: {
      fontWeight: '500',
      fontSize: 14,
    },
    activeLanguageText: {
      color: '#FFFFFF',
    },
    version: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: 24,
      marginBottom: 24,
      fontSize: 12,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Apariencia */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
        
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <View style={styles.iconContainer}>
              <Ionicons name={isDarkMode ? "moon" : "sunny"} size={22} color={colors.text} />
            </View>
            <Text style={styles.itemText}>{t('settings.darkMode')}</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D1D5DB', true: `${colors.primary}80` }}
            thumbColor={isDarkMode ? colors.primary : '#FFFFFF'}
          />
        </View>
      </View>
      
      {/* Idioma */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        
        <View style={[styles.item, styles.lastItem]}>
          <View style={styles.itemContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="language" size={22} color={colors.text} />
            </View>
            <Text style={styles.itemText}>{t('settings.selectLanguage')}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'en' && styles.activeLanguage
              ]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[
                styles.languageButtonText,
                { color: currentLanguage === 'en' ? '#FFFFFF' : colors.text }
              ]}>
                EN
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.languageButton,
                currentLanguage === 'es' && styles.activeLanguage
              ]}
              onPress={() => changeLanguage('es')}
            >
              <Text style={[
                styles.languageButtonText,
                { color: currentLanguage === 'es' ? '#FFFFFF' : colors.text }
              ]}>
                ES
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Información de la app */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="information-circle-outline" size={22} color={colors.text} />
            </View>
            <Text style={styles.itemText}>{t('settings.aboutApp')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
        
        <View style={[styles.item, styles.lastItem]}>
          <View style={styles.itemContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="help-circle-outline" size={22} color={colors.text} />
            </View>
            <Text style={styles.itemText}>{t('settings.help')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </View>
      
      <Text style={styles.version}>ORSEMA v1.0.0</Text>
    </ScrollView>
  );
};

export default Settings;