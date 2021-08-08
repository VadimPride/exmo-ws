window.$$exmoWS$$ = {};
$$exmoWS$$.index = function (apiKey, secretKey, settingList){
    
    $$exmoWS$$.Helpers.EventEmitter.call(this);
    var $this = this;
    var __apiKey    = false;
    var __secretKey = false;
    var __settingList  = typeof settingList === 'object' ? settingList : {};

    var __publicObject  = new $$exmoWS$$.PublicWS(this);
    var __privateObject = new $$exmoWS$$.PrivateWS(this);

    
    /**
     *
     * @return {$$exmoWS$$.PublicWS}
     */
    this.getPublicObject = function (){
        return __publicObject;
    };
    
    /**
     *
     * @return {$$exmoWS$$.PrivateWS}
     */
    this.getPrivateObject = function (){
        return __privateObject;
    };
    
    /**
     *
     * @returns {string}
     */
    this.getApiKey = function (){
        return __apiKey;
    };

    /**
     *
     * @returns {string}
     */
    this.getSecretKey = function (){
        return __secretKey;
    };
    
    /**
     *
     * @param apiKey
     * @return {boolean}
     */
    this.setApiKey = function (apiKey){
        if(typeof apiKey !== 'string' || !apiKey.length){
            return false;
        }
        __apiKey = apiKey;
        this.emit('setApiKey', apiKey);
        return true;
    };
    
    /**
     *
     * @param secretKey
     * @return {boolean}
     */
    this.setSecretKey = function (secretKey){
        if(typeof secretKey !== 'string' || !secretKey.length){
            return false;
        }
        __secretKey = secretKey;
        this.emit('setSecretKey', secretKey);
        return true;
    };
    
    /**
     *
     * @returns {{}}
     */
    this.getSettingList = function (){
        return __settingList || {};
    }

    /**
     *
     * @param key
     * @param def
     * @returns {*}
     */
    this.getSetting = function (key, def){
        return this.getSettingList()[key] || def;
    }
    
    
    // PUBLIC API ------------------------------------------------------------------------------------------------------
    
    /**
     *
     * @param pair
     * @return {Promise}
     */
    this.spotTrades = function (pair){
        return __publicObject.spotTrades(pair);
    };
    
    /**
     *
     * @param pair
     * @return {Promise}
     */
    this.spotTicker = function (pair){
        return __publicObject.spotTicker(pair);
    };
    
    /**
     *
     * @param pair
     * @return {Promise}
     */
    this.spotOrderBookSnapshots = function (pair){
        return __publicObject.spotOrderBookSnapshots(pair);
    };
    
    /**
     *
     * @param pair
     * @return {Promise}
     */
    this.spotOrderBookUpdates = function (pair){
        return __publicObject.spotOrderBookUpdates(pair);
    };
    
    // /PUBLIC API -----------------------------------------------------------------------------------------------------
    
    
    // PRIVATE API -----------------------------------------------------------------------------------------------------
    
    /**
     *
     * @return {Promise}
     */
    this.spotUserTrades = function (){
        return __privateObject.spotUserTrades();
    };
    
    /**
     *
     * @return {Promise}
     */
    this.spotWallet = function (){
        return __privateObject.spotWallet();
    };
    
    /**
     *
     * @return {Promise}
     */
    this.spotOrders = function (){
        return __privateObject.spotOrders();
    };
    
    (function (){
        if(typeof $$exmoWS$$.WebSocket !== 'function'){
            throw new Error('Websocket not support');
        }
        if(typeof $$exmoWS$$.CryptoJS !== 'object'){
            throw new Error('Module "crypto-js" not found.');
        }
        $this.setApiKey(apiKey);
        $this.setSecretKey(secretKey);
        
        var setAuthData = function (){
            __privateObject.closeConnection();
        };
        $this.on('setApiKey', function (){
            setAuthData();
        });
        $this.on('setSecretKey', function (){
            setAuthData();
        });
        
    })();
}
window.$$exmoWS$$ = $$exmoWS$$.index;
window.$$exmoWS$$.process = undefined;
window.$$exmoWS$$.global = undefined;
window.$$exmoWS$$.window = window;
window.$$exmoWS$$.WebSocket = WebSocket;
window.$$exmoWS$$.CryptoJS = CryptoJS;
/**
 *
 * @return {$$exmoWS$$.index}
 */
$$exmoWS$$.Helpers = new function(){

    /**
     *
     * @returns {Window|boolean}
     */
    this.getWindow = function (){
        return $$exmoWS$$.window || false;
    };

    /**
     *
     * @returns {Process|boolean}
     */
    this.getProcess = function (){
        return $$exmoWS$$.process || false;
    };
    
    /**
     *
     * @returns {Process|boolean}
     */
    this.getGlobal = function (){
        return $$exmoWS$$.global || false;
    };
    
    /**
     *
     * @param min
     * @param max
     * @returns {number}
     */
    this.getRandInt = function (min, max){
        return Math.floor(min + Math.random() * (max + 1 - min));
    }
    
    
    this.EventEmitter = function() {
        var $this = this;
        var __listerens = {};
        var __incListeren = 0;
        var __maxListeners = 10;
        var __prefix_once = '_once';


        /**
         * Append EE listeren
         * @param name
         * @param callback
         * @param once
         * @return {EventEmitter}
         */
        this.on = function(name, callback, once) {
            if(typeof name !== 'string' || typeof callback !== 'function'){
                return $this;
            }
            ++__incListeren;

            var i = String(String(__incListeren) + (once === true ? __prefix_once : ''));
            if(typeof __listerens[name] !== 'object'){
                __listerens[name] = {};
            }
            __listerens[name][i] = callback;
            if(__maxListeners > 0 && $this.listenerCount(name) > __maxListeners){
                console.warn('EventEmitter ', name, ', exceeded maxListeners : ', __maxListeners + '/' + $this.listenerCount(name), '. Use EE.setMaxListeners(n)!');
            }
            return $this;
        };

        /**
         * Apend once EE listeren
         * @param name
         * @param callback
         * @return {EventEmitter}
         */
        this.once = function(name, callback){
            return $this.on(name, callback, true);
        };

        /**
         * Getter all listeren name
         * @returns {string[]}
         */
        this.getListerensName = function(){
            return Object.keys(__listerens);
        };

        /**
         * Clear all listeren
         * @returns {{}}
         */
        this.clearAllListerens = function(){
            var listerens = $this.getListerensName();
            for(var i in listerens){
                $this.offAll(listerens[i]);
            }
            return __listerens;
        };

        /**
         * Getter count Event listeren
         * @param name
         * @returns {number}
         */
        this.listenerCount = function(name){
            var count = 0;
            if(typeof name !== 'string' || typeof __listerens[name] !== 'object'){
                return count;
            }
            return Object.keys(__listerens[name]).length;
        };

        /**
         * Set max listeners
         * @param count
         * @returns {boolean}
         */
        this.setMaxListeners = function(count){
            if(typeof count !== 'number'){
                return false;
            }
            __maxListeners = parseInt(count);
            return true;
        };

        /**
         * Delete EventEmitter listeren
         * @param name
         * @param callback
         * @return {EventEmitter}
         */
        this.off = function(name, callback){

            if(typeof name !== 'string' || typeof callback !== 'function' || typeof __listerens[name] !== 'object'){
                return $this;
            }
            for(var i in __listerens[name]){
                if(__listerens[name][i] === callback){
                    delete __listerens[name][i];
                }
            }
            if(Object.keys(__listerens[name]).length === 0){
                delete __listerens[name];
            }
            return $this;
        };

        /**
         * Delete all EventEmitter listeren
         * @param name
         * @return {EventEmitter}
         */
        this.offAll = function(name){
            if(typeof __listerens[name] !== 'object'){
                return $this;
            }
            for(var i in __listerens[name]){
                delete __listerens[name][i];
            }
            delete __listerens[name];
            return $this;
        };

        /**
         * Emit EE listeren
         * @param name
         * @param data_1
         * @param data_2
         * @param data_3
         * @param data_4
         * @param data_5
         * @return {EventEmitter}
         */
        this.emit = function(name, data_1, data_2, data_3, data_4, data_5){
            if(typeof name !== 'string' || typeof __listerens[name] !== 'object'){
                return $this;
            }
            for(var i in __listerens[name]){
                if(typeof __listerens[name][i] === 'function'){
                    __listerens[name][i].call(this, data_1, data_2, data_3, data_4, data_5);
                    if(i.indexOf(__prefix_once) >= 0){
                        $this.off(name, __listerens[name][i]);
                    }
                }
            }
            return $this;
        };
    };

    this.getUID = function (){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c,r){return ('x'== c ? ( r = Math.random()*16|0) : (r&0x3|0x8)).toString(16);});
    };

    /**
     *
     * @param uid
     * @returns {boolean}
     */
    this.checkUID = function (uid){
        return !!(new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")).test(String(uid));
    };
};
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

$$exmoWS$$.WSObject = function (url){
    $$exmoWS$$.Helpers.EventEmitter.call(this);
    
    var $this = this;
    var __ws = false;
    var __messageInc = 0;
    var __subscribeObjectList = {};
    
    
    /**
     *
     * @param topic
     * @return {$$exmoWS$$.SubscribeObject}
     * @private
     */
    var _createSubscribe = function (topic){
        var subscribeObject = $this.getSubscribeObject(topic);
        if(subscribeObject){
            return subscribeObject;
        }
        subscribeObject = new $$exmoWS$$.SubscribeObject(topic);
        __subscribeObjectList[subscribeObject.getTopic()] = subscribeObject;
        subscribeObject.once('unsubscribe', function (){
            delete __subscribeObjectList[subscribeObject.getTopic()];
            $this.emit('unsubscribe', subscribeObject);
            $this.unsubscribe(subscribeObject.getTopic()).catch(function (){});
        });
        subscribeObject.on('update', function (){
            $this.emit('subscribe|update', subscribeObject);
        });
        $this.emit('subscribe', subscribeObject);
        return subscribeObject;
    };
    
    /**
     *
     * @return {Promise<$$exmoWS$$.WebSocket>}
     */
    this.getWS = function (){
        return new Promise(function (resolve, reject){
            if(__ws) return resolve(__ws);
            if(__ws === null){
                var closeHandler = function (e){
                    reject(new Error(e.reason || 'close'));
                    $this.once('ws|open', openHandler);
                    $this.once('ws|error', errorHandler);
                };
                var errorHandler = function (e){
                    reject(new Error(e.error || 'error'));
                    $this.once('ws|open', openHandler);
                    $this.off('ws|close', closeHandler);
                };
                var openHandler = function (ws){
                    resolve(ws);
                    $this.off('ws|error', errorHandler);
                    $this.off('ws|close', closeHandler);
                };
                $this.once('ws|open', openHandler);
                $this.once('ws|error', errorHandler);
                $this.once('ws|close', closeHandler);
                return;
            }
            __ws = null;

            var ws = new $$exmoWS$$.WebSocket(url);
    
            ws.closeConnection = function (msg){
                if(ws.isConnection()){
                    try{
                        ws.close(1000, String(msg || 'close'));
                        return true;
                    }catch (e){
                        console.error(e);
                    }
                }
                return false;
            };
            ws.isConnection = function (){
                return ws.readyState === 1;
            };
            ws.sendMessage = function (msg){
                try{
                    if(ws.isConnection()){
                        ws.send(String(msg));
                        return true;
                    }
                }catch (e){}
                return false;
            };
            ws.sendObject = function(object) {
                try {
                    if(ws.isConnection()){
                        ws.send(JSON.stringify(object));
                        return true;
                    }
                }catch (e){}
                return false;
            };
            var isOpen = false;
            ws.onopen = function (){
                isOpen = true;
                __ws = ws;
                resolve(ws);
                $this.emit('ws|open', ws);
            };
            ws.onerror = function (e){
                __ws = false;
                reject(new Error(e.error || 'error'));
                $this.emit('ws|error', e);
            };
            ws.onclose = function (e){
                __ws = false;
                reject(new Error(e.reason || 'close'));
                $this.emit('ws|close', e);
            };
            ws.onmessage = function (e){
                var msg = String(e.data || '');
                $this.emit('ws|message', msg);
                try{
                    var data = JSON.parse(msg);
                    if(data.id){
                        $this.emit('ws|data|'+data.id, data);
                    }
                    var subscribeObject = false;
                    if(data.event === "info" && typeof data.message === 'string'){
                        $this.emit('info', data.message);
                    }
                    if(data.event === 'subscribed' && typeof data.topic === 'string'){
                        _createSubscribe(data.topic);
                    }
                    if(data.event === 'update' && typeof data.topic === 'string' && typeof data.data === 'object'){
                        subscribeObject = $this.getSubscribeObject(data.topic);
                        if(subscribeObject){
                            subscribeObject.update(data.data);
                        }
                    }
                    if(data.event === 'unsubscribe' && typeof data.topic === 'string'){
                        subscribeObject = $this.getSubscribeObject(data.topic);
                        if(subscribeObject){
                            subscribeObject.unsubscribe();
                        }
                    }
                    $this.emit('ws|data', data);
                }catch (e){
                    console.error(e);
                }
            };
        });
    };
    
    /**
     *
     * @return {boolean}
     */
    this.isConnection = function (){
        return __ws && __ws.isConnection();
    };
    
    /**
     *
     * @return {boolean}
     */
    this.closeConnection = function (){
        if(!__ws || !__ws.isConnection()){
            return false;
        }
        return __ws.closeConnection();
    };
    
    /**
     *
     * @param data
     * @return {Promise}
     */
    this.preSend = function (data){
        return new Promise(function (resolve) {
            resolve();
        });
    };
    
    /**
     *
     * @param data
     * @param ttl
     * @return {Promise<{}>}
     */
    this.send = function (data, ttl, notPreSend){
        return new Promise(function (resolve, reject){
            ttl = parseInt(ttl || '2000');
            var isRes = false;
            if(typeof ttl !== "number"){
                return reject(new Error('Invalid TTL value'));
            }
            var timeout = false;
            var msgHandler = function (data){
                try{
                    isRes = true;
                    if(timeout){
                        clearTimeout(timeout);
                        timeout = false;
                    }
                }catch (e){}
                if(data.event === 'error' || data.error){
                    return reject(new Error(data.error || data.message || 'Unknown error'));
                }
                return resolve(data);
            }
            timeout = setTimeout(function (msgHandler){
                msgHandler({'error' : 'ttl'});
            }, ttl, msgHandler);
            $this.getWS().then(function (ws) {
                var preSend = notPreSend ? function(){return new Promise(function (resolve){resolve();})} : $this.preSend;
    
                preSend(data).then(function (){
                    if(isRes){
                        return reject(new Error('Res#21992'));
                    }
                    data.id = ++__messageInc;
                    var eventName = 'ws|data|'+data.id;
                    $this.once(eventName, msgHandler);
                    if(!ws.sendObject(data)){
                        $this.removeListener(eventName, msgHandler);
                    }
                }).catch(function (e){
                    reject(e);
                });
            }).catch(function (e){
                reject(new Error('ConnectionError->'+e.message));
            });
        });
    };
    
    
    
    /**
     *
     * @return Object
     */
    this.getSubscribeObjectList = function (){
        return __subscribeObjectList;
    };
    
    /**
     *
     * @param topic
     * @return {$$exmoWS$$.SubscribeObject|boolean}
     */
    this.getSubscribeObject = function (topic){
        return this.getSubscribeObjectList()[topic] || false;
    }
    
    /**
     *
     * @param topic
     * @return {Promise}
     */
    this.subscribe = function (topic){
        return new Promise(function (resolve, reject){
            if(typeof topic !== 'string' || !topic.length){
                return reject(new Error('InvalidTopic'));
            }
            var subscribeObject = $this.getSubscribeObject(topic);
            if(subscribeObject){
                return resolve(subscribeObject);
            }
            $this.send({
                "method": "subscribe",
                "topics": [
                    topic
                ]
            }).then(function (e){
                if(e['event'] !== 'subscribed'){
                    console.error('UnknownErrorSubscribe', e);
                    return reject(new Error('UnknownErrorSubscribe'));
                }
                subscribeObject = _createSubscribe(topic);
                return resolve(subscribeObject);
            }).catch(function (e){
                reject(e);
            });
        });
    };
    
    /**
     *
     * @param topic
     * @return {Promise<$$exmoWS$$.SubscribeObject>}
     */
    this.unsubscribe = function (topic){
        return new Promise(function (resolve, reject){
            if(typeof topic !== 'string' || !topic.length){
                return reject(new Error('InvalidTopic'));
            }
            var subscribeObject = $this.getSubscribeObject(topic);
            if(!subscribeObject){
                return reject(new Error('SubscribeNotFound'));
            }
            $this.send({
                "method": "unsubscribe",
                "topics": [
                    topic
                ]
            }).then(function (e){
                if(e['event'] !== 'unsubscribed'){
                    console.error('UnknownErrorUnsubscribe', e);
                    return reject(new Error('UnknownErrorUnsubscribe'));
                }
                return resolve(subscribeObject);
            }).catch(function (e){
                reject(e);
            });
        });
    };
    
    
    (function (){
    
        $this.on('ws|open', function (){
            $this.emit('connect', $this);
        });
        $this.on('ws|close', function (){
            $this.emit('disconnect', $this);
            var list = $this.getSubscribeObjectList();
            for(var i in list){
                try{
                    list[i].unsubscribe();
                }catch (e){
                
                }
            }
        });
        $this.on('ws|message', function (message){
            $this.emit('message', message);
        });
        $this.on('ws|data', function (data){
            $this.emit('data', data);
        });
        
        
    })();
};
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