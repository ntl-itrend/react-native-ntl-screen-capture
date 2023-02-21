#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNtlScreenCaptureSpec.h"

@interface NtlScreenCapture : RCTEventEmitter <NativeNtlScreenCaptureSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NtlScreenCapture : RCTEventEmitter <RCTBridgeModule>
#endif

@end
