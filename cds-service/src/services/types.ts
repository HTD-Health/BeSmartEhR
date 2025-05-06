import { CardIndicator } from '../types';

export type AgeGroupInfo = {
  name: 'Unknown Age' | 'Pediatric' | 'Young Adult' | 'Middle Adult' | 'Senior';
  headerBgColor: string;
  contentBgColor: string;
  indicator: CardIndicator;
};

export type AssessmentResult = {
  summary: string;
  indicator: CardIndicator;
  detail: string;
  suggestions: Array<{
    label: string;
    uuid?: string;
  }>;
};
