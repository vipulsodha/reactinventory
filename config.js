var config = {
	'host': 'localhost',
	'port': 5000,
	'app_url': 'http://localhost:5000',
	'api_url': 'http://localhost:5000',
	'client_id': '1234567'
	}
	
	
	config.oauth_redirect_url= config.app_url + '/authcoderedirect';
	config.scope= 'notification';
	config.oauth_url ='http://webengage.net/oauth2/authorize?client_id=' + config.client_id + '&redirect_uri='+config.oauth_redirect_url+'&scope='+config.scope

module.exports = config 
