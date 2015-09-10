const CONSTANTS = {
  // MQTT_BROKER: 'mqtt://voyager.orientsoft.cn:11883'
  MQTT_BROKER: 'mqtt://z.borgnix.com:1883'
, MQTT_COMMANDS: {
    UPLOAD_START: 'upload/start'
  , UPLOAD_STOP: 'upload/stop'
  , UPLOAD_READY: 'upload/ready'
  , PORT_IN: 'in'
  , PORT_OUT: 'out'
  , DEBUG_START: 'debug/start'
  , DEBUG_STOP: 'debug/stop'
  }
}

module.exports = CONSTANTS
