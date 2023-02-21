import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
const LINKING_ERROR =
  `The package 'react-native-ntl-screen-capture' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NtlScreenCaptureModule = isTurboModuleEnabled
  ? require('./NativeNtlScreenCapture').default
  : NativeModules.NtlScreenCapture;

const NtlScreenCapture = NtlScreenCaptureModule
  ? NtlScreenCaptureModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

enum EventsName {
  UserDidCapture = 'onCapture',
}

const detectorEventEmitter = new NativeEventEmitter(NtlScreenCapture);

type Unsubscribe = () => void;

const commonAddScreenshotListener = (
  listener: (isCapture: boolean) => void
): Unsubscribe => {
  const eventSubscription = detectorEventEmitter.addListener(
    EventsName.UserDidCapture,
    (isCapture) => listener(isCapture),
    {}
  );

  return () => {
    eventSubscription.remove();
  };
};

const getListenersCount = (): number => {
  return (
    // React Native 0.64+
    // @ts-ignore
    detectorEventEmitter.listenerCount?.(EventsName.UserDidCapture) ??
    // React Native < 0.64
    // @ts-ignore
    detectorEventEmitter.listeners?.(EventsName.UserDidCapture).length ??
    0
  );
};

export const addScreenCaptureListener = Platform.select<
  (listener: (isCapture: boolean) => void) => Unsubscribe
>({
  ios: commonAddScreenshotListener,
  default: (listener: (isCapture: boolean) => void): Unsubscribe => {
    if (getListenersCount() === 0) {
      NtlScreenCapture.startScreenshotDetection();
    }

    const unsubscribe: Unsubscribe = commonAddScreenshotListener(listener);

    return () => {
      unsubscribe();

      if (getListenersCount() === 0) {
        NtlScreenCapture.stopScreenshotDetection();
      }
    };
  },
});

export default {
  addScreenCaptureListener,
};
