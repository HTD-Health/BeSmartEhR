export enum CDSHooksEvent {
  PATIENT_VIEW = 'patient-view',
  ORDER_SELECT = 'order-select',
  ORDER_SIGN = 'order-sign',
}

export enum Services {
  PATIENT_ASSESSMENT = 'patient-view',
  ORDER_ASSISTANT = 'order-select',
  ORDER_REVIEW = 'order-sign',
}

export type CardIndicator = 'info' | 'warning' | 'critical';
