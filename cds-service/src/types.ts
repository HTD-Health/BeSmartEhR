export enum CdsHooksEvent {
  PATIENT_VIEW = 'patient-view',
  ORDER_SELECT = 'order-select',
  ORDER_SIGN = 'order-sign',
}

export enum Services {
  PATIENT_ASSESSMENT = 'patient-assessment',
  ORDER_ASSISTANT = 'order-assistant',
  ORDER_REVIEW = 'order-review',
}

export type CardIndicator = 'info' | 'warning' | 'critical';
