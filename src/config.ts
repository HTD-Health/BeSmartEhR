export default {
  port: process.env.PORT || 3010,
  serviceName: 'HTD Health CDS Service',
  serviceBaseUrl: process.env.SERVICE_BASE_URL || 'http://localhost:3010',
  icons: {
    logo: 'https://htdhealth.com/wp-content/themes/htd/assets/favicons/light/favicon-96x96.png',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
