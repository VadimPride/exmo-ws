
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