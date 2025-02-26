import { GestureDescription, Finger, FingerCurl } from 'fingerpose';
  
const CloseGesture = new GestureDescription('close');
const OpenGesture = new GestureDescription('open');
const OneGesture = new GestureDescription('one');
const TwoGesture = new GestureDescription('two');

CloseGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 1.0);
CloseGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);

for(let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
    CloseGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
    CloseGesture.addCurl(finger, FingerCurl.HalfCurl, 0.9);
}

for(let finger of Finger.all) {
    OpenGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
}

OneGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
OneGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
OneGesture.addCurl(Finger.Middle, FingerCurl.HalfCurl, 0.9);
OneGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
OneGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);
OneGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
OneGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);

TwoGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
TwoGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
  
// ring: curled
TwoGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
TwoGesture.addCurl(Finger.Ring, FingerCurl.HalfCurl, 0.9);

// pinky: curled
TwoGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
TwoGesture.addCurl(Finger.Pinky, FingerCurl.HalfCurl, 0.9);


export {
    CloseGesture, OpenGesture, TwoGesture, OneGesture
}