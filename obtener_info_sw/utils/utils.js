const https = require('https');
const {config} = require('../config')
module.exports = function () {
    
    this.mapeo_traduccion_keys = function (data, dict_params_trad) { 
        
        new_tmp_e = {}
        Object.keys(data).forEach(function(key) {
            
            new_tmp_e[dict_params_trad[key]] = data[key]
            
        });
        
        return new_tmp_e
    }
}