const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const {config} = require('./config.js')
const { v4: uuidv4 } = require('uuid');

async function createItem(params){
  try {
    await docClient.put(params).promise();
  } catch (err) {
    return err;
  }
}

exports.handler = async (event) => {
  try {
    console.log(event["body"])
    body = JSON.parse(event["body"])
    
    if (body == null || Object.keys(body).length === 0){
      return { error: "No existen parametros validos para la creacion" }
    }
    if(!body["nombre"] || !body["apellido"] || !body["edad"] || !body["profesion"]){
      return { error: "No existen parametros validos para la creacion" }
    }
    p_nombre = body["nombre"]
    p_apellido =body["apellido"]
    p_edad =  body["edad"]
    p_profesion = body["profesion"]
    //Verificar parametros de persona
    const params = {
      TableName : config.tabla_dynamo,
      /* Item properties will depend on your application concerns */
      Item: {
        id_persona: uuidv4(),
        nombre: p_nombre,
        apellido: p_apellido,
        edad: p_edad,
        profesion: p_profesion
      }
    }

    resp = await createItem(params)
    
    message = "Se creo exitosamente"
    elemento= params.Item
    return { message, elemento }
  } catch (err) {
    console.log(err)
    return { statusCode: 500, error: err.message }
  }
};
