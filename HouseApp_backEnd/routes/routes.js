const indexRoutes = require('./index');
const settingsRoutes = require('./settings');
const userRoutes = require('./users');
const tagRoutes = require('./tags');
const houseRoutes = require('./houses');

app.use('/', indexRoutes);
app.use('/settings', settingsRoutes);
app.use('/users', userRoutes);
app.use('/tags', tagRoutes);
app.use('/houses', houseRoutes);