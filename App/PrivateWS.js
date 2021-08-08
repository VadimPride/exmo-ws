$$exmoWS$$.PrivateWS = function (__exmoWS){
	$$exmoWS$$.WSObject.call(this, 'wss://ws-api.exmo.com:443/v1/private');
	
	var $this = this;
	var __auth = false;
	
	
	/**
	 *
	 * @return {Promise}
	 */
	this.preSend = function (){
		return new Promise(function (resolve, reject){
			if(__auth){
				return resolve();
			}
			
			var apiKey = __exmoWS.getApiKey();
			var secretKey = __exmoWS.getSecretKey();
			if(typeof apiKey !== 'string' || !apiKey.length){
				return reject(new Error('InvalidApiKey'));
			}
			if(typeof secretKey !== 'string' || !secretKey.length){
				return reject(new Error('InvalidSecretKey'));
			}
			var nonce = Date.now();
			$this.send({
				"method": "login",
				"api_key": apiKey,
				"sign": $$exmoWS$$.CryptoJS.HmacSHA512(apiKey + nonce, secretKey).toString($$exmoWS$$.CryptoJS.enc.Base64),
				"nonce": nonce
			}, 700, true).then(function (data){
				if(data.event !== 'logged_in'){
					return reject(new Error('InvalidAuth'));
				}
				__auth = true;
				resolve();
			}).catch(function (e){
				return reject(new Error('InvalidAuth->'+e.message));
			});
		});
	};
	
	
	/**
	 *
	 * @return {Promise}
	 */
	this.spotUserTrades = function (){
		return this.subscribe('spot/user_trades');
	};
	
	/**
	 *
	 * @return {Promise}
	 */
	this.spotWallet = function (){
		return this.subscribe('spot/wallet');
	};
	
	/**
	 *
	 * @return {Promise}
	 */
	this.spotOrders = function (){
		return this.subscribe('spot/orders');
	};
	
	
	(function (){
		$this.on('ws|close', function (){
			__auth = false;
		});
	})();
};