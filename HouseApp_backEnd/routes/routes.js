const indexRoutes = require('./index');
const settingsRoutes = require('./settings');

app.use('/', indexRoutes);
app.use('/settings', settingsRoutes);