$$exmoWS$$.SubscribeObject = function (topic){
	$$exmoWS$$.Helpers.EventEmitter.call(this);
	
	var __topic = topic;
	var __data = {};
	var __status = $$exmoWS$$.SubscribeObject.STATUS_SUBSCRIBE;
	var __updateDate = Date.now();
	
	/**
	 *
	 * @return {number}
	 */
	this.getStatus = function (){
		return __status;
	};
	
	/**
	 *
	 * @return {boolean}
	 */
	this.isSubscribe = function (){
		return this.getStatus() === $$exmoWS$$.SubscribeObject.STATUS_SUBSCRIBE;
	};
	
	/**
	 *
 	 * @return {boolean}
	 */
	this.isUnsubscribe = function (){
		return this.getStatus() === $$exmoWS$$.SubscribeObject.STATUS_UNSUBSCRIBE;
	};
	
	/**
	 *
	 * @return {String}
	 */
	this.getTopic = function (){
		return __topic;
	};
	
	/**
	 *
	 * @return {Object}
	 */
	this.getData = function (){
		return typeof __data === 'object' ? __data : {};
	};
	
	
	/**
	 *
	 * @return {boolean}
	 */
	this.unsubscribe = function (){
		if(this.isUnsubscribe()){
			return false;
		}
		this.emit('unsubscribe', this);
		// Clear all events
		this.clearAllListerens();
		return true;
	};
	
	/**
	 *
	 * @param data
	 * @return {boolean}
	 */
	this.update = function (data){
		if(typeof data !== 'object'){
			return false;
		}
		__data = data;
		__updateDate = Date.now();
		this.emit('update', this);
	};
	
	
};

$$exmoWS$$.SubscribeObject.STATUS_UNSUBSCRIBE = 0;
$$exmoWS$$.SubscribeObject.STATUS_SUBSCRIBE = 1;