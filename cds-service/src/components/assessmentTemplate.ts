import type { AgeGroupInfo } from '../services/types';

export const generateAssessmentHtml = (
  fullName: string,
  age: number | null,
  ageGroup: AgeGroupInfo
): string => {
  const textColor = '#FFFFFF';
  const darkTextColor = '#333333';
  const ageDisplay = age !== null ? age.toString() : '?';
  const ageText = age !== null ? `${age} years` : 'Unknown';

  return `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px;">
    <div style="background-color: ${ageGroup.headerBgColor}; color: ${textColor}; padding: 15px; border-radius: 8px 8px 0 0; display: flex; align-items: center;">
      <div style="width: 40px; height: 40px; border-radius: 50%; background-color: ${ageGroup.contentBgColor}; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
        <span style="font-size: 20px; color: ${ageGroup.headerBgColor};">${ageDisplay}</span>
      </div>
      <div>
        <h3 style="margin: 0; margin-bottom: 4px;">${fullName}</h3>
        <span style="font-size: 14px;">${ageGroup.name} patient${age !== null ? ` (${age} years)` : ''}</span>
      </div>
    </div>
    
    <div style="background-color: #ffffff; border: 1px solid ${ageGroup.headerBgColor}; border-top: none; padding: 15px; border-radius: 0 0 8px 8px;">
      <p style="margin-top: 0; color: ${darkTextColor};">
        ${fullName}'s health profile has been reviewed by HTD Health.
      </p>
      
      <div style="background-color: ${ageGroup.contentBgColor}; padding: 10px; border-radius: 4px; margin-top: 10px;">
        <p style="margin: 0; color: ${darkTextColor}; font-weight: 500;">
          Age Group: ${ageGroup.name}
          <br>Age: ${ageText}
        </p>
      </div>
    </div>
  </div>`;
};
