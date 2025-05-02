// components/Activities/Activities.styles.ts
import { StyleSheet, Platform } from 'react-native';
import { ThemeColors } from '../ThemeContext';

export const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.success,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.success,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: `0 2px 5px ${colors.success}40`,
      },
    }),
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    color: colors.text,
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: 12,
    padding: 6,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCellInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    width: '100%',
    textAlign: 'center',
    backgroundColor: colors.inputBg,
    color: colors.text,
  },
  readOnlyInput: {
    backgroundColor: colors.inputBg,
    opacity: 0.8,
  },
  switchTrack: {
    backgroundColor: colors.inputBg,
  },
  switchThumb: {
    backgroundColor: colors.card,
  },
  activeSwitch: {
    backgroundColor: `${colors.success}80`,
  },
  activeThumb: {
    backgroundColor: colors.success,
  },
  pointsPositive: {
    color: colors.success,
  },
  pointsNegative: {
    color: colors.danger,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: colors.danger,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: `0 2px 4px ${colors.danger}40`,
      },
    }),
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});