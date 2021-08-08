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