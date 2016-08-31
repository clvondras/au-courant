const spawn = require('child_process').spawn;
const mongoose = require('mongoose');
const Promise = require('bluebird');
const path = require('path');
const fs = require('fs');
const Moment = require('moment');
const Day = require('./models.js').Day;
const schedule = require('node-schedule');
const EventEmitter = require('events');


module.exports = class Logger extends EventEmitter {
  constructor(conf) {
    super();
    this.config = conf;
    this.interval = config.interval;
    this.getCurrentDay();
  }
  log() {
    return new Promise((resolve, reject) => {
      const child = spawn(this.config.bin, this.config.parameters);
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (data) => {
        resolve.apply(
          this,
          data.toString().split(', ')
        );
      });
      child.stderr.on('data', reject);
      child.stdin.end();
    });
  }
  record(name, title, url, ssid, ip) {
    const entry = {
      unix: new Moment(),
      name,
      title,
      url,
      ssid,
      ip,
    };
    this.currentDay.push(entry);
    this.currentDay.save();
    this.emit('data');
  }
  getCurrentDay() {
    const today = new Moment();
    Day.find({
      date: +today.startOf('day'),
    })
      .exec()
      .then((doc) => {
        this.currentDay = doc;
      })
      .catch((err) => {
        this.currentDay = new Day({
          unix: today.startOf('day'),
        });
        this.currentDay.save();
      })
      .finally(() => {
        schedule.scheduleJob('@midnight', this.getCurrentDay);
        this.emit('ready');
      });
  }
};


function getConfig() {
  // Retrieve configs
  const configs = JSON.parse(fs.readFileSync(path.join(__dirname,
    'configs.json'), 'utf8'));

  switch (process.platform) {
    case 'linux':
    case 'linux2':
      config = configs.linux;
      break;
    case 'win32':
      config = configs.win32;
      break;
    case 'darwin':
      config = configs.mac;
      break;
    default:
      throw 'Operating System not supported yet. ' + process.platform;
  }
  // Append directory to script url
  script_url = path.join(__dirname, config.script_url);
  config.parameters.push(script_url);

  // Append directory to subscript url on OSX
  if (process.platform == 'darwin') {
    config.parameters.push(path.join(__dirname, config.subscript_url));
  }

  return config;
}


const config = getConfig();
const mongoURL = 'mongodb://localhost/test';

mongoose.connect(mongoURL);
