var app = {
	//test
	channelSecret: '',
    channelAccessToken: '',
    
//sql connect
	user: '',
	password: '',
	server: '',
	database: '',
	port: 1433,
	options: {
	encrypt: true // Use this if you're on Windows Azure
	},
	pool: {
	min: 0,
	max: 10,
	idleTimeoutMillis: 3000
	}
};
module.exports = app;