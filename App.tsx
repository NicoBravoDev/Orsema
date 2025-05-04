// App.tsx - Actualizado con UserHeader y navegación modificada
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ScrollView, View, Platform } from 'react-native';

// Importar configuración i18n
import './i18n';
import { useTranslation } from 'react-i18next';

// Tema
import { ThemeProvider, useTheme } from './components/ThemeContext';

// Componentes
import Header from './components/Header/Header';
import Activities from './components/Activities/Activities';
import AdditionalItems from './components/AdditionalItems/AdditionalItems';
import Objectives from './components/Objectives/Objectives';
import TabBar, { TabName } from './components/TabBar/TabBar';
import UserHeader from './components/UserHeader/UserHeader';
import Settings from './components/Settings/Settings';

// Modales
import ActivityModal from './components/Modals/ActivityModal';
import AdditionalItemModal from './components/Modals/AdditionalItemModal';
import ObjectiveModal from './components/Modals/ObjectiveModal';

// Utilidades
import { ScoreCalculator } from './utils/ScoreCalculator';

// Tipos
import {
  ActivityItem,
  ObjectiveItem,
  AdditionalItem,
  DateState,
  PointsState,
  NewActivityState,
  NewAdditionalItemState,
  NewObjectiveState
} from './components/types/types';

const AppContent = () => {
  const { isDarkMode, colors } = useTheme();
  const { t } = useTranslation();
  
  // Estado para la navegación de pestañas
  const [activeTab, setActiveTab] = useState<TabName>('home');
  
  // Estados básicos
  const [date, setDate] = useState<DateState>({ day: 18, month: 10, year: 24 });
  const [points, setPoints] = useState<PointsState>({ arrival: -11995, achieved: -555, total: -12450 });
  
  // Estados para ventanas modales
  const [showActivityModal, setShowActivityModal] = useState<boolean>(false);
  const [showAdditionalItemModal, setShowAdditionalItemModal] = useState<boolean>(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState<boolean>(false);
  
  // Estados para nuevos elementos
  const [newActivity, setNewActivity] = useState<NewActivityState>({ name: '', jerar: '1' });
  const [newAdditionalItem, setNewAdditionalItem] = useState<NewAdditionalItemState>({ action: '', med: t('measures.units') });
  const [newObjective, setNewObjective] = useState<NewObjectiveState>({ text: '', activityId: '' });
  
  // Estado de actividades
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: 1, name: 'Meditación', jerar: 2, nivel: 2, sum: 5, x: 4, points: 26, activityDone: false },
    { id: 2, name: 'Visualización', jerar: 3, nivel: 1, sum: 4, x: 13, points: -156, activityDone: false },
    { id: 3, name: 'Vocalización', jerar: 3, nivel: 1, sum: 0, x: 25, points: -300, activityDone: false }
  ]);
  
  // Estado para objetivos con relación a actividades
  const [objectives, setObjectives] = useState<ObjectiveItem[]>([
    { id: 1, text: 'Meditar 3 min', completed: true, activityId: 1 },
    { id: 2, text: 'Hacer/dar 10 cosas', completed: false, activityId: null }
  ]);
  
  // Estado para datos adicionales simplificado
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([
    { id: 1, action: 'Horas YT', cant: '5', med: 'Hrs' },
    { id: 2, action: 'No. Ra', cant: '2', med: 'Und' }
  ]);

  // Estado para ajustes de puntos por elementos adicionales
  const [additionalAdjustments, setAdditionalAdjustments] = useState<number>(0);

  // Datos del usuario
  const [userData] = useState({
    username: "Nicolas Bravo",
    email: "nicolas.pulgar.bravo@gmail.com"
  });

  // Actualizar newAdditionalItem.med cuando cambia el idioma
  useEffect(() => {
    setNewAdditionalItem(prev => ({ ...prev, med: t('measures.units') }));
  }, [t]);

  // Efecto para recalcular el puntaje total cuando cambian las actividades o los ajustes adicionales
  useEffect(() => {
    // Sumar puntos de las actividades
    let achievedPoints = activities.reduce((sum, activity) => sum + activity.points, 0);
    
    // Añadir ajustes adicionales
    achievedPoints += additionalAdjustments;
    
    // Actualizar el estado de puntos
    setPoints(prevPoints => ({
      ...prevPoints,
      achieved: achievedPoints,
      total: prevPoints.arrival + achievedPoints
    }));
  }, [activities, additionalAdjustments]);
  
  // Función para actualizar los ajustes adicionales (para YouTube, proteína, etc.)
  const updateAdditionalAdjustments = (adjustment: number) => {
    setAdditionalAdjustments(adjustment);
  };
  
  // Funciones para ventanas modales
  const handleAddActivity = () => {
    if (newActivity.name.trim() === '') {
      alert(t('alerts.emptyActivityName'));
      return;
    }
    
    const newId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    setActivities([...activities, {
      id: newId,
      name: newActivity.name,
      jerar: parseInt(newActivity.jerar) || 1,
      nivel: 1,
      sum: 0,
      x: 5,
      points: 0,
      activityDone: false
    }]);
    
    setNewActivity({ name: '', jerar: '1' });
    setShowActivityModal(false);
  };
  
  const handleAddAdditionalItem = () => {
    if (newAdditionalItem.action.trim() === '') {
      alert(t('alerts.emptyActionName'));
      return;
    }
    
    const newId = additionalItems.length > 0 ? Math.max(...additionalItems.map(a => a.id)) + 1 : 1;
    setAdditionalItems([...additionalItems, {
      id: newId,
      action: newAdditionalItem.action,
      cant: '',
      med: newAdditionalItem.med
    }]);
    
    setNewAdditionalItem({ action: '', med: t('measures.units') });
    setShowAdditionalItemModal(false);
  };
  
  const handleAddObjective = () => {
    if (newObjective.text.trim() === '') {
      alert(t('alerts.emptyObjectiveText'));
      return;
    }
    
    const newId = objectives.length > 0 ? Math.max(...objectives.map(o => o.id)) + 1 : 1;
    setObjectives([...objectives, {
      id: newId,
      text: newObjective.text,
      completed: false,
      activityId: newObjective.activityId ? parseInt(newObjective.activityId) : null
    }]);
    
    setNewObjective({ text: '', activityId: '' });
    setShowObjectiveModal(false);
  };
  
  // Otras funciones
  const updateActivity = (id: number, field: string, value: any) => {
    setActivities(activities.map(activity => {
      if (activity.id !== id) return activity;
      
      // Actualizar el campo específico
      const updatedActivity = { ...activity, [field]: value };
      
      // Calcular nuevos puntos (sin cambiar X)
      const associatedObjective = objectives.find(obj => obj.activityId === activity.id);
      const updatedWithPoints = ScoreCalculator.updateActivity(updatedActivity, associatedObjective);
      
      return updatedWithPoints;
    }));
  };
  
  const removeActivity = (id: number) => {
    setActivities(activities.filter(a => a.id !== id));
    setObjectives(objectives.map(obj => 
      obj.activityId === id ? {...obj, activityId: null} : obj
    ));
  };
  
  const toggleObjective = (id: number) => {
    // Actualizar el objetivo
    setObjectives(objectives.map(obj => {
      if (obj.id !== id) return obj;
      return { ...obj, completed: !obj.completed };
    }));
    
    // Encontrar el objetivo actualizado
    const updatedObjective = objectives.find(obj => obj.id === id);
    if (!updatedObjective || updatedObjective.activityId === null) return;
    
    // Si el objetivo está asociado a una actividad, actualizar la actividad (solo puntos, no X)
    const activity = activities.find(act => act.id === updatedObjective.activityId);
    if (!activity) return;
    
    // Crear una copia del objetivo con el estado actualizado
    const toggledObjective = { ...updatedObjective, completed: !updatedObjective.completed };
    
    // Actualizar los puntos de la actividad sin cambiar X
    const updatedActivity = ScoreCalculator.updateActivity(activity, toggledObjective);
    
    // Actualizar la actividad
    setActivities(activities.map(act => 
      act.id === updatedActivity.id ? updatedActivity : act
    ));
  };
  
  const updateObjectiveText = (id: number, text: string) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, text } : obj
    ));
  };
  
  const removeObjective = (id: number) => {
    setObjectives(objectives.filter(o => o.id !== id));
  };
  
  const setObjectiveActivity = (objId: number, actId: string) => {
    // Actualizar la relación objetivo-actividad
    setObjectives(objectives.map(obj => 
      obj.id === objId ? { ...obj, activityId: actId ? parseInt(actId) : null } : obj
    ));
    
    // Actualizar puntos de la actividad afectada (sin cambiar X)
    if (actId) {
      const activityId = parseInt(actId);
      const objective = objectives.find(obj => obj.id === objId);
      if (!objective) return;
      
      const activity = activities.find(act => act.id === activityId);
      if (!activity) return;
      
      // Actualizar el objetivo con la nueva relación
      const updatedObjective = { ...objective, activityId: activityId };
      
      // Actualizar la actividad con el nuevo objetivo (solo puntos, no X)
      const updatedActivity = ScoreCalculator.updateActivity(activity, updatedObjective);
      
      // Actualizar la actividad
      setActivities(activities.map(act => 
        act.id === updatedActivity.id ? updatedActivity : act
      ));
    }
  };
  
  const updateAdditionalItem = (id: number, field: string, value: any) => {
    setAdditionalItems(additionalItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    
    // Recalcular ajustes después de actualizar el item
    const youtubeAdj = ScoreCalculator.calculateYoutubeAdjustment(
      additionalItems.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
    const proteinAdj = ScoreCalculator.calculateProteinAdjustment(
      additionalItems.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
    updateAdditionalAdjustments(youtubeAdj + proteinAdj);
  };
  
  const removeAdditionalItem = (id: number) => {
    setAdditionalItems(additionalItems.filter(item => item.id !== id));
    
    // Recalcular ajustes después de eliminar el item
    const updatedItems = additionalItems.filter(item => item.id !== id);
    const youtubeAdj = ScoreCalculator.calculateYoutubeAdjustment(updatedItems);
    const proteinAdj = ScoreCalculator.calculateProteinAdjustment(updatedItems);
    updateAdditionalAdjustments(youtubeAdj + proteinAdj);
  };
  
  // Función modificada: Ahora aplica los cambios pendientes en X
  const saveToFirebase = () => {
    // Aplicar los cambios pendientes de X basados en el estado actual
    const updatedActivities = ScoreCalculator.applyPendingXChanges(activities, objectives);
    
    // Actualizar el estado con las actividades actualizadas
    setActivities(updatedActivities);
    
    console.log("Datos guardados:", { 
      date, 
      points, 
      activities: updatedActivities, 
      objectives, 
      additionalItems 
    });
    
    alert(t('alerts.dataSaved'));
  };
  
  const resetData = () => {
    // Reset actividades (solo cambiar estado, no X)
    setActivities(activities.map(act => {
      const resetActivity = { ...act, activityDone: false };
      const associatedObjective = objectives.find(obj => obj.activityId === act.id);
      
      // Actualizar puntos sin cambiar X
      return ScoreCalculator.updateActivity(resetActivity, associatedObjective);
    }));
    
    // Reset objetivos
    setObjectives(objectives.map(obj => ({ ...obj, completed: false })));
    
    alert(t('alerts.dataReset'));
  };

  // Renderizado condicional basado en la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            {/* Componente Header */}
            <Header 
              date={date} 
              points={points} 
              setDate={setDate} 
              setPoints={setPoints} 
              saveToFirebase={saveToFirebase} 
              resetData={resetData} 
            />
            
            {/* Componente Activities */}
            <Activities 
              activities={activities} 
              objectives={objectives} 
              updateActivity={updateActivity} 
              setActivities={setActivities}
              removeActivity={removeActivity} 
              toggleObjective={toggleObjective} 
              setShowActivityModal={setShowActivityModal} 
            />
            
            {/* Componente AdditionalItems */}
            <AdditionalItems 
              additionalItems={additionalItems} 
              updateAdditionalItem={updateAdditionalItem} 
              removeAdditionalItem={removeAdditionalItem} 
              setShowAdditionalItemModal={setShowAdditionalItemModal} 
              updateTotalPoints={updateAdditionalAdjustments}
            />
            
            {/* Componente Objectives */}
            <Objectives 
              objectives={objectives} 
              activities={activities} 
              toggleObjective={toggleObjective} 
              updateObjectiveText={updateObjectiveText} 
              removeObjective={removeObjective} 
              setObjectiveActivity={setObjectiveActivity} 
              setShowObjectiveModal={setShowObjectiveModal} 
              setActivities={setActivities}
              updateActivity={updateActivity}
            />
          </>
        );
      case 'stats':
        // Reemplazar con el componente de estadísticas cuando lo tengas
        return (
          <View style={styles.placeholderContainer}>
            {/* Aquí irá tu componente de estadísticas */}
          </View>
        );
      case 'calendar':
        // Reemplazar con el componente de calendario cuando lo tengas
        return (
          <View style={styles.placeholderContainer}>
            {/* Aquí irá tu componente de calendario */}
          </View>
        );
      case 'settings':
        // Ahora usamos el componente Settings real
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Header de usuario fijo */}
      <UserHeader username={userData.username} email={userData.email} />
      
      {/* Contenido principal con margen para el header */}
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer, 
          { paddingTop: 76 } // Altura del header + padding
        ]}
      >
        {renderTabContent()}
      </ScrollView>
      
      {/* Barra de navegación inferior */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Modales */}
      <ActivityModal 
        showModal={showActivityModal} 
        setShowModal={setShowActivityModal} 
        newActivity={newActivity} 
        setNewActivity={setNewActivity} 
        handleAddActivity={handleAddActivity} 
      />
      
      <AdditionalItemModal 
        showModal={showAdditionalItemModal} 
        setShowModal={setShowAdditionalItemModal} 
        newAdditionalItem={newAdditionalItem} 
        setNewAdditionalItem={setNewAdditionalItem} 
        handleAddAdditionalItem={handleAddAdditionalItem} 
      />
      
      <ObjectiveModal 
        showModal={showObjectiveModal} 
        setShowModal={setShowObjectiveModal} 
        newObjective={newObjective} 
        setNewObjective={setNewObjective} 
        handleAddObjective={handleAddObjective} 
        activities={activities} 
      />
    </SafeAreaView>
  );
};

// App principal con ThemeProvider
const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80, // Espacio adicional para la barra de navegación
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 300,
  },
});

export default App;