
var os = require('os');
var HID = require('node-hid');

const NIKE_VENDOR_ID = 0x11ac;
const NIKE_PRODUCT_ID = 0x5455;

var devices = HID.devices();
// console.log("HID devices:", devices);

const isNikeSportwatch = function(d) { return d.vendorId === NIKE_VENDOR_ID && d.productId === NIKE_PRODUCT_ID; }
const isRawHidUsage = function(d) { return d.usagePage === 0xFF00; }

const deviceInfo = devices.find( function(d) { return isNikeSportwatch(d) && isRawHidUsage(d); });
let device;
if( deviceInfo ) { 
    device = new HID.HID( deviceInfo.path );
}

console.log("deviceInfo: ", deviceInfo);
if( !device ) {
    console.log(devices);
    console.log("Could not find RawHID device in device list");
    process.exit(1);
}

console.log("Attaching receive 'data' handler");
device.on('data', function(data) {
    console.log("got data:", data.toString('hex') );
});
device.on('error', function(err) {
    console.log("error:",err);
});

const readEepromMessage = [
    0x09 , 0x05 , 0xb3 , 0x10 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ];

console.log("Sending messages");
console.log('Sending message: ', JSON.stringify(readEepromMessage))
var numsentA = device.write(readEepromMessage);
console.log('messageA len:', readEepromMessage.length, 'actual sent len:', numsentA);

console.log("Waiting for data");
setTimeout( function() {
    console.log("Done");
    device.close();
}, 30000);