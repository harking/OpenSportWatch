import HID from 'node-hid';

import OpenSportWatch from './OpenSportWatch.js';

const NIKE_VENDOR_ID = 0x11ac;
const NIKE_PRODUCT_ID = 0x5455;

export default class NikeSportWatch extends OpenSportWatch {

    constructor() {
        super();
        this.init();
    }

    init() {
        this.device = null;
        this.timeout = null;
    }

    /**
     * Tries to find a connected watch.
     * If found, connects device event listeners, and returns a HID device object that can be interacted with. 
     * Otherwise returns null
     * 
     * @returns device
     */
    connect() {
        let devices = HID.devices();
        // console.log("HID devices:", devices);
        const isNikeSportwatch = function(d) { return d.vendorId === NIKE_VENDOR_ID && d.productId === NIKE_PRODUCT_ID; }
        const isRawHidUsage = function(d) { return d.usagePage === 0xFF00; }

        const deviceInfo = devices.find( function(d) { return isNikeSportwatch(d) && isRawHidUsage(d); });
        let device;
        if( deviceInfo ) { 
            device = new HID.HID( deviceInfo.path );
        }

        console.log("deviceInfo: ", deviceInfo);
        if (!device) {
            console.log(devices);
            console.error("Could not find RawHID device in device list");
            // process.exit(1);
            return null
        }

        console.log("Attaching receive 'data' handler");
        device.on('data', this.onReceiveData);
        device.on('error', this.onDeviceError);

        this.device = device;
        return device;
    }

    closeDevice() {
        if (this.device) {
            this.device.close();
            this.init();
        }
    }

    startDeviceTimeout() {
        this.timeout = setTimeout(() => {
            console.log("Done");
            this.closeDevice();
        }, 30000);
    }

    readData() {
        if (!this.device) {
            console.error('Error: Connect to device before trying to read from it');
            return;
        }

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
        var numsentA = this.device.write(readEepromMessage);
        console.log('messageA len:', readEepromMessage.length, 'actual sent len:', numsentA);

        console.log("Waiting for data");
        this.startDeviceTimeout();
    }

    onReceiveData(data) {
        console.log("Receive data:", data.toString('hex') );
    }

    onDeviceError(error) {
        console.error("Error:", error);
    }

    // const readSerialMessage = [
    //     0x09 , 0x05 , 0xb3 , 0x21 , 0x00 , 0x00 , 0x00 , 0x00 ,
    //     0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    //     0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    //     0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    //     0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    //     0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    //     0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ,
    //     0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 ];
}