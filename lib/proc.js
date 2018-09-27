/**
 * Author @nadir93
 * Date 2018.6.17
 */
const AWS = require('aws-sdk');
const firehose = new AWS.Firehose();
const log = require('./log');

const proc = (event) => {

  const fireHoseInput = [];
  event.Records.forEach((record) => {

    log.debug('eventID:', record.eventID);
    log.debug('eventName:', record.eventName);
    log.debug('NewImage:', record.dynamodb.NewImage);

    if (record.eventName === 'INSERT') {
      record.dynamodb.NewImage.eventName = {
        S: 'INSERT'
      }
      fireHoseInput.push({
        Data: JSON.stringify(record.dynamodb.NewImage)
      });
    } else if (record.eventName === 'REMOVE') {
      record.dynamodb.NewImage.eventName = {
        S: 'REMOVE'
      }
      fireHoseInput.push({
        Data: JSON.stringify(record.dynamodb.NewImage)
      });
    } else if (record.eventName === 'MODIFY') {
      record.dynamodb.NewImage.eventName = {
        S: 'MODIFY'
      }
      fireHoseInput.push({
        Data: JSON.stringify(record.dynamodb.NewImage)
      });
    }
  });

  const params = {
    DeliveryStreamName: 'GD_GSRV_STREAM',
    Records: fireHoseInput
  };

  return firehose
    .putRecordBatch(params)
    .promise();
}

module.exports = proc;