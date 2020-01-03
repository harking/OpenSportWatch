import NikeSportWatch from './NikeSportWatch.js';

let device = new NikeSportWatch();
device.connect();
device.readData();