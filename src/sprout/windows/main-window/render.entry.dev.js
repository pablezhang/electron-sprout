require('@babel/register')(require('../../../../config/babel-entry-config'));
process.env.NODE_ENV = 'development';
require('./main');
