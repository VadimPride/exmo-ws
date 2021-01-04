

const Api = require('./Api')

module.exports = class Public extends Api
{
    constructor() {
        super();
        this.on('connect', (ws) => {

        });
    }
}