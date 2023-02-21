
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNNtlScreenCaptureSpec.h"

@interface NtlScreenCapture : NSObject <NativeNtlScreenCaptureSpec>
#else
#import <React/RCTBridgeModule.h>

@interface NtlScreenCapture : NSObject <RCTBridgeModule>
#endif

@end
