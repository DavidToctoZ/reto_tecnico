const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const {config} = require('./config.js')
const params = {
  TableName : config.tabla_dynamo
}

async function listItems(){
  try {
    const data = await docClient.scan(params).promise()
    return data
  } catch (err) {
    return err
  }
}

exports.handler = async (event, context) => {
  try {
    const data = await listItems()
    console.log( "d", data)
    personas =  data["Items"]
    return {personas }
  } catch (err) {
    console.log(err)
    return { statusCode: 500, error: err }
  }
}