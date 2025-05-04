// components/LanguageSelector/LanguageSelector.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageSelectorProps {
  compact?: boolean;
  isDarkMode?: boolean;
  primaryColor?: string;
  textColor?: string;
}

// Clave para almacenar el idioma seleccionado
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  compact = false, 
  isDarkMode = false,
  primaryColor = '#3B82F6', 
  textColor = '#FFFFFF'
}) => {
  const { i18n } = useTranslation();
  
  const currentLanguage = i18n.language;
  
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
    // Guardar el idioma seleccionado
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
  };
  
  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactButton,
          { backgroundColor: primaryColor }
        ]}
        onPress={toggleLanguage}
      >
        <Ionicons name="language" size={16} color={textColor} />
        <Text style={[styles.compactButtonText, { color: textColor }]}>
          {currentLanguage.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: currentLanguage === 'en' ? primaryColor : 'transparent' },
          { borderColor: isDarkMode ? '#555' : '#DDD' }
        ]}
        onPress={() => {
          i18n.changeLanguage('en');
          AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
        }}
      >
        <Text style={[
          styles.buttonText,
          { color: currentLanguage === 'en' ? textColor : (isDarkMode ? '#FFF' : '#333') }
        ]}>
          English
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: currentLanguage === 'es' ? primaryColor : 'transparent' },
          { borderColor: isDarkMode ? '#555' : '#DDD' }
        ]}
        onPress={() => {
          i18n.changeLanguage('es');
          AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, 'es');
        }}
      >
        <Text style={[
          styles.buttonText,
          { color: currentLanguage === 'es' ? textColor : (isDarkMode ? '#FFF' : '#333') }
        ]}>
          Español
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
  },
  compactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  compactButtonText: {
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  }
});

export default LanguageSelector;