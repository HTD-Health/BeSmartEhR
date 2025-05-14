import * as dotenv from 'dotenv';

dotenv.config();

console.log('Environment Variables:', process.env);

export default {
  port: process.env.PORT || 3011,
  serviceName: `HTD Health CDS Service${process.env.NODE_ENV === 'development' ? ' (DEV)' : ''}`,
  icons: {
    logo: 'https://htdhealth.com/wp-content/themes/htd/assets/favicons/light/favicon-96x96.png',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  smartApp: {
    url: process.env.SMART_APP_URL || 'https://smart-app.htdhealth.com',
    name: 'Patient in SMART app',
  },
};
