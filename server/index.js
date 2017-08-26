import express from 'express';
import path from 'path';
import Sequelize from 'sequelize';
import bodyParser from 'body-parser';
var PORT = process.env.PORT || 3000;
var env = process.env.NODE_ENV || 'production';
var config = require(path.join(__dirname, 'config', 'config.json'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
import db from './models';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';

import users from './routes/users';
import auth from './routes/auth';
import events from './routes/events';

let app = express();

db.sequelize.sync().then(function() {
    console.log('looks fine');
});

app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/events', events);

const compiler = webpack(webpackConfig);

app.use(webpackMiddleware(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  noInfo: true
}));
app.use(webpackHotMiddleware(compiler));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
  });
});
