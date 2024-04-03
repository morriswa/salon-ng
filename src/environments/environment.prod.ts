
export const environment = {
  production: true,
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
