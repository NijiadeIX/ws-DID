var runServer = require('./server/server.js');

//start the server
if (process.argv.length >= 3)
{
	runServer(parseInt(process.argv[2]));
} else {
	runServer();
}