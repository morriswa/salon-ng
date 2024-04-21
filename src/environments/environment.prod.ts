
export const environment = {
  production: true,
  webService: {
    path: 'https://salon.morriswa.org/api',
    publicUrls : [
      '/register',
      '/health',
      '/public/featuredEmployees',
      '/public/profile/**',
    ]
  }
};
