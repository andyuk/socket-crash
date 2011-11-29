var io = require('socket.io-client'),
    optimist = require('optimist'),
    fs = require('fs'),
    async = require('async'),
    _und = require('underscore')._;

var argv = optimist
    .usage('Count the lines in a file.\nUsage: $0')
    .demand('c')
    .alias('c', 'config')
    .describe('c', 'Config file path')
    .argv;

//var io = sio.listen(config.port);

var crashObj = new Crash();

async.waterfall([
  function readConfig(callback) {
    crashObj.readConfigFile(argv.config, callback);
  },
  function connect(callback) {
    
    var err = crashObj.validateConfig();

    if (err) {
      callback(err);
      return;
    }
    
    crashObj.connect();
    
    callback(null);
  }
],
function(err) {
  if (err) {
    console.log(err);
  }
});

function Crash() {
  this.config = null;
  this.socket = null;
  
  this.data = [
    'a',
    'b'
  /*
    undefined,
    null,
    '',
    0,
    {},
    []
    function(response) { console.log('got response!!');  }
    */
  ];
  
};

Crash.prototype.readConfigFile = function(path, callback) {

  var self = this,
      err = null,
      config = null;

  fs.readFile(argv.config, 'utf8', function (err, data) {
    if (err) {
      err = 'Unable to read config file "' + argv.config + '". Check the file path is correct.';
    }
  
    try {
    
      self.config = JSON.parse(data);
    
    } catch(exception) {
      err = "Unable to parse JSON in config file. Check the JSON is valid.";
    }
    
    callback(err);
  });
};

Crash.prototype.validateConfig = function() {
  
  // TODO: 
  
  return null;
};

Crash.prototype.connect = function() {

  this.socket = io.connect(this.config.socketio.uri, this.config.socketio.config);
  this.listen();
};

Crash.prototype.listen = function() {
  
  var self = this;
  
  this.socket.on('connect', function () {
    // socket connected
    console.log('connected');
    
    self.runTests();
  });

  this.socket.on('disconnect', function () {
    // socket disconnected
    console.log('disconnected');

    process.exit(0);
  });

}

Crash.prototype.runTests = function() {
  

  
  // 
  
  //console.log(this.data);
  //console.log(this.config.events);
  
  var args,
      count = 0,
      variations = 0;

  for (var i=0; i < this.config.events.length; i++) {
    
    var event = this.config.events[i];
    //console.log(event);
    
    // run up to 5 parameters
    for (var numArgs=1; numArgs < 3; numArgs++) {

      for (var startIndex=0; startIndex < this.data.length; startIndex++) {  
        
        
            

      }

      args = this.getArguments(numArgs, startIndex);
      count++;
      console.log(args + ' variations for ' );
      
      //this.socket.emit(event, args.length);
    }
    
    console.log(event, count + ' tests run');
    
  }
  
  
  
  /*
  1
  2
  
  1,1
  1,2
  2,1
  2,2
  */
  
  
  this.socket.disconnect();
};

Crash.prototype.getArguments = function (numArgs, startIndex) {
  
  if (numArgs === 0) {
    throw 'Invalid call. numArgs must be at least 1';
  }
  
  var args = [],
      index = 0,
      variations = 0;
  
  for (var i=0; i<this.data.length; i++) {
  
    variations += Math.pow(numArgs, startIndex+1);
    
    // for each data variation
    /*
    for (var j=0; j<this.data.length; j++) {
      
      
      args.push(this.data[index]);
    }*/
    
    index = (i + startIndex) % this.data.length;
    args.push(this.data[index]);
  }
  return variations;
}



