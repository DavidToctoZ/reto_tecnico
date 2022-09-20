const https = require('https')
const {config} = require('./config.js')
const swapi = require('./api/swapi.js');
const utils = require('./utils/utils.js');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const params_db = {
  TableName : config.tabla_dynamo
}

async function listItems(){
  try {

    var data = await docClient.scan(params_db).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async  function(event) {
    try{
        console.log(event["queryStringParameters"]);
        var params = event["queryStringParameters"]
        console.log("PARAMS", params)
        infoMovies = ""
        responseCode = 200
        var u = new utils()

        
        results = await swapi.swapiModule.getFilms();
        infoMovies = JSON.parse(results)["results"]
        list_tmp = []
        infoMovies.forEach(function(e){ 
            tmp_dict = u.mapeo_traduccion_keys(e, config.parametros_esp);
            list_tmp.push(tmp_dict)
        })
        infoMovies = list_tmp

        personas = {}
        if (params == null){
            return {personas, infoMovies}
        }else{
            
            if (params.hasOwnProperty('episodio_id')){
                infoMovies = ""
                results = await swapi.swapiModule.getFilm(params["episodio_id"]);
                infoMovies = JSON.parse(results)

                infoMovies = u.mapeo_traduccion_keys(infoMovies, config.parametros_esp)
                console.log(infoMovies);
                tmp_l = []
                tmp_l.push(infoMovies)
                console.log(tmp_l)
                infoMovies = tmp_l
            }

            if (params.hasOwnProperty('ver_personas')){
                console.log("existe el parametro")
                if(params["ver_personas"] == 1){
                    const data = await listItems()
                    
                    personas =  data["Items"]
                    return {personas, infoMovies};
                }
                
                
            }
        }

        return {personas, infoMovies};
  } catch (error) {
      console.log('Error is:', error);
      return {
        statusCode: 500,
        body: error.message,
      };
  }
  
};
