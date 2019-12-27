require('@babel/register')(require('./babel-entry-config'));
process.env.NODE_ENV = 'development';
require('./main');
