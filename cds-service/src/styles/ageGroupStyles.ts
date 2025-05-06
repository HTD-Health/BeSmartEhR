import { AgeGroupInfo } from '../services/types';

export const getAgeGroupInfo = (age: number | null): AgeGroupInfo => {
  if (age === null) {
    // Unknown age - gray theme
    return {
      name: 'Unknown Age',
      headerBgColor: '#9E9E9E',
      contentBgColor: '#F5F5F5',
      indicator: 'info',
    };
  } else if (age < 18) {
    // Pediatric patients - blue theme
    return {
      name: 'Pediatric',
      headerBgColor: '#1E88E5',
      contentBgColor: '#E3F2FD',
      indicator: 'info',
    };
  } else if (age >= 18 && age < 40) {
    // Young adult - green theme
    return {
      name: 'Young Adult',
      headerBgColor: '#43A047',
      contentBgColor: '#E8F5E9',
      indicator: 'info',
    };
  } else if (age >= 40 && age < 65) {
    // Middle-aged adult - purple theme
    return {
      name: 'Middle Adult',
      headerBgColor: '#7B1FA2',
      contentBgColor: '#F3E5F5',
      indicator: 'info',
    };
  } else {
    // Senior - orange theme
    return {
      name: 'Senior',
      headerBgColor: '#FB8C00',
      contentBgColor: '#FFF3E0',
      indicator: 'warning',
    };
  }
};
