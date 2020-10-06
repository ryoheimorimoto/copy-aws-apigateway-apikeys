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

const main = async (from, to) => {
  console.log('Start to copy API Keys.');

  updateAwsConfig(from);

  const keys = await getApiKeys();
  console.log(keys);

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
          value: x.value
        }
      });
      resolve(keyList);
    }).catch((error) => {
      reject(error);
    });
  });
}

main(sourceAWSConfig, destinationAWSConfig);
