
export const environment = {
  production: false,
  webService: {
    path: 'https://api.salon.morriswa.org',
    publicUrls : [
      '/register',
      '/health',
      '/public/featuredEmployees',
      '/public/profile/**',
    ]
  }
};
