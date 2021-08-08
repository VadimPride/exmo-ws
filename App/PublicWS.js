$$exmoWS$$.PublicWS = function (__exmoWS){
	var $this = this;
	
	$$exmoWS$$.WSObject.call(this, 'wss://ws-api.exmo.com:443/v1/public');
	
	/**
	 *
	 * @param pair
	 * @return {Promise}
	 */
	this.spotTrades = function (pair){
		return this.subscribe('spot/trades:'+String(pair || ''));
	};
	
	/**
	 *
	 * @param pair
	 * @return {Promise}
	 */
	this.spotTicker = function (pair){
		return this.subscribe('spot/ticker:'+String(pair || ''));
	};
	
	/**
	 *
	 * @param pair
	 * @return {Promise}
	 */
	this.spotOrderBookSnapshots = function (pair){
		return this.subscribe('spot/order_book_snapshots::'+String(pair || ''));
	};
	
	/**
	 *
	 * @param pair
	 * @return {Promise}
	 */
	this.spotOrderBookUpdates = function (pair){
		return this.subscribe('spot/order_book_updates::'+String(pair || ''));
	};
	
};