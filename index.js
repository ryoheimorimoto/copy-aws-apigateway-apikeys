'use strict'
const AWS = require('aws-sdk');

const sourceAWSConfig = {
  accessKeyId: 'xxx',
  secretAccessKey: 'xxx',
  region: 'us-east-1'
}

const destinationAWSConfig = {
  accessKeyId: 'xxx',
  secretAccessKey: 'xxx',
  region: 'us-east-1'
}

const main = async (source, destination) => {
  console.log('Start to copy API Keys.');

  updateAwsConfig(source);
  const keys = await getApiKeys();
  console.log(`Num of API Keys to migrate: ${keys.length}`);

  updateAwsConfig(destination);
  for (const key of keys) {
    await createApiKey(key.name, key.value, key.description);
    console.log(`API Key: '${key.name}' is migrated.`);
  }

  console.log(`${keys.length} Api Keys are migrated.`);
}

const updateAwsConfig = (config) => {
  AWS.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  });
}

const getApiKeys = () => {
  return new Promise((resolve, reject) => {
    const apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});

    const params = {
      includeValues: true
    };

    apigateway.getApiKeys(params).promise().then((resp) => {
      const keyList = resp.items.map(x => {
        return {
          name: x.name,
          value: x.value,
          description: x.description
        }
      });
      resolve(keyList);
    }).catch((error) => {
      reject(error);
    });
  });
}

const createApiKey = (name, value, description) => {
  return new Promise((resolve, reject) => {
    const apigateway = new AWS.APIGateway({apiVersion: '2015-07-09'});

    const params = {
      enabled: true,
      name,
      value,
      description
    };

    apigateway.createApiKey(params).promise().then(() => {
      resolve();
    }).catch((error) => {
      reject(error);
    });
  });
}

main(sourceAWSConfig, destinationAWSConfig);
