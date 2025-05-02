// src/index.ts
import { registerRootComponent } from 'expo';
import App from './App';

// Registrar el componente raíz para la aplicación Expo
registerRootComponent(App);

// Si estás usando React Native sin Expo, usa esto en su lugar:
/*
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('OrsemaApp', () => App);
*/