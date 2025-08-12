import { colors } from './colors';

export const buttonVariants = {
  primary: {
    background: colors.primary[600],
    color: '#ffffff',
    hover: colors.primary[700],
    focus: colors.primary[500],
  },
  secondary: {
    background: colors.secondary[100],
    color: colors.secondary[900],
    hover: colors.secondary[200],
    focus: colors.secondary[300],
  },
  success: {
    background: colors.success[600],
    color: '#ffffff',
    hover: colors.success[700],
    focus: colors.success[500],
  },
  warning: {
    background: colors.warning[500],
    color: '#ffffff',
    hover: colors.warning[600],
    focus: colors.warning[400],
  },
  error: {
    background: colors.error[600],
    color: '#ffffff',
    hover: colors.error[700],
    focus: colors.error[500],
  },
};

export const inputVariants = {
  default: {
    background: '#ffffff',
    border: colors.gray[300],
    focus: colors.primary[500],
    text: colors.gray[900],
    placeholder: colors.gray[500],
  },
  error: {
    background: '#ffffff',
    border: colors.error[300],
    focus: colors.error[500],
    text: colors.gray[900],
    placeholder: colors.gray[500],
  },
};

export const cardVariants = {
  default: {
    background: '#ffffff',
    border: colors.gray[200],
    shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  },
  elevated: {
    background: '#ffffff',
    border: colors.gray[200],
    shadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
};

export const statusColors = {
  active: colors.success[500],
  inactive: colors.gray[400],
  pending: colors.warning[500],
  emergency: colors.error[600],
  critical: colors.error[700],
  stable: colors.success[600],
  discharged: colors.gray[600],
};

export default {
  buttonVariants,
  inputVariants,
  cardVariants,
  statusColors,
};