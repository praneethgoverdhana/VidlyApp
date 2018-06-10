const express = require('express');
const app = express();

const devDebugger = require('debug')('app:dev');

const config = require('config');
const genres = require('./routes/genres');

const morgan = require('morgan');

app.use(express.json());
if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    devDebugger('Using Morgan....');
}

app.use('/api/genres', genres);

app.get('/', (request, response)=> {
    response.send('Welcome to Vidly Application!');
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    devDebugger("Server started.. listening on port: ", port);
})



