import usbDetect from 'usb-detection';

usbDetect.startMonitoring();

const NIKE_VENDOR_ID = 4524;
const NIKE_SPORTWATCH_PRODUCT_ID = 21588;
const NIKE_SPORTWATCH_PRODUCT_ID_2 = 21589;

usbDetect.on(`add:${NIKE_VENDOR_ID}:${NIKE_SPORTWATCH_PRODUCT_ID}`, function(device) {
	console.log("Nike Sportwatch GPS Plugged In");
});
usbDetect.on('remove', function(device) {
	console.log("Nike Sportwatch GPS Unplugged");
});

usbDetect.on(`add:${NIKE_VENDOR_ID}:${NIKE_SPORTWATCH_PRODUCT_ID_2}`, function(device) {
	console.log("Nike Sportwatch GPS 2 Plugged In");
});
usbDetect.on(`remove:${NIKE_VENDOR_ID}:${NIKE_SPORTWATCH_PRODUCT_ID_2}`, function(device) {
	console.log("Nike Sportwatch GPS 2 Unplugged");
});