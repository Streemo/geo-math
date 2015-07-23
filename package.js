Package.describe({
  name: 'streemo:geo-math',
  version: '0.0.1',
  summary: 'Minimal package that provides simple geolocation helper functions for short distances.',
  git: 'https://github.com/Streemo/geo-math',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('lib/geo-math.js');
  api.export(['GeoMath']);
});