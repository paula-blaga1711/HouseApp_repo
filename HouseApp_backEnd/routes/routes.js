const indexRoutes = require('./index');
const settingsRoutes = require('./settings');
const userRoutes = require('./users');

app.use('/', indexRoutes);
app.use('/settings', settingsRoutes);
app.use('/users', userRoutes);