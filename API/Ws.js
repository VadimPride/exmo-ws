
let   MESSAGE_INC = 0;
const MESSAGE_TTL = 5000;


const WebSocket = require('ws');

module.exports = class Ws extends (require('events'))
{
    constructor(ws_url) {
        super();
        this.__ws = undefined;
        this.__wsConnectCount = 0;
        this.__wsUrl = String(ws_url);
        this.__messageList = {};
        this.on('disconnect', ($this) => {
            setTimeout(() => {
                $this.getWs().catch(() => {});
            }, 2000, $this);
        });
    }

    getWsUrl(){
        return this.__wsUrl;
    }

    /**
     *
     * @returns {Promise}
     */
    async getWs() {
        const $this = this;
        return new Promise((resolve, reject) => {
            if(typeof $this.__ws === 'object'){
                return resolve($this.__ws);
            }
            if($this.__ws === null){
                return $this.once('connect', (ws) => {
                    resolve(ws);
                });
            }
            $this.__ws = null;
            let ws = new WebSocket($this.getWsUrl());
            ws.sendData = (data) => {
                return new Promise((res, rej) => {
                    if(typeof data !== 'object'){
                        return reject(new Error('Data not object'));
                    }
                    data['id'] = ++MESSAGE_INC;
                    $this.__messageList[data.id] = data;
                    const resoponceHandler = () => {

                    };
                    $this.once('message|ID|'+data.id, (data) => {
                        if($this.__messageList[data.id]){
                            delete $this.__messageList[data.id];
                        }
                        resolve(data);
                    });
                    setTimeout(($this, id) => {
                        if($this.__messageList[id]){
                            delete $this.__messageList[data.id];
                        }
                        reject(new Error('timeout'));
                    }, 5000, $this, data.id);

                    try{
                        this.send(JSON.stringify(data));
                        return true;
                    }catch (e){}
                    return false;
                })

            }
            ws.onopen = (ws) => {
                $this.__ws = ws;
                if($this.__wsConnectCount++){
                    $this.emit('reconnect', ws);
                }
                $this.emit('connect', ws);
            };
            const disconnectHandler = () => {
                $this.__ws = undefined;
                $this.emit('disconnect', $this);
                reject();
            };
            ws.onerror = disconnectHandler;
            ws.onclose = disconnectHandler;
            ws.onmessage = (data) => {
                console.log('message', data);
            };
        });
    }

    async sendData(data){
        if(typeof data !== 'object'){
            throw new Error('Invalid data');
        }
        const ws = await this.getWs();

    }


    async subscribe(topics){
        const $this = this;
        return new Promise((resolve, reject) => {
            $this.getWs().then((ws) => {

                ws.sendData({

                });
            }).catch((e) => {
                reject(e);
            })
        });
    }

}