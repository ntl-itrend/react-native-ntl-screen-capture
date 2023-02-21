#import "NtlScreenCapture.h"

@implementation NtlScreenCapture
RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
- (NSArray<NSString *> *)supportedEvents {
    return @[@"onCapture"];
}

- (void)startObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIScreenCapturedDidChangeNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sendNotificationToRN) name:UIScreenCapturedDidChangeNotification object:nil];
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)sendNotificationToRN:(NSNotification *)notification {
    BOOL isCaptured = [[UIScreen mainScreen] isCaptured];

    if (isCaptured) {
        [self sendEventWithName:notification.name
                       body:@NO];
    } else {
        [self sendEventWithName:notification.name
                       body:@YES];
    }
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeNtlScreenCaptureSpecJSI>(params);
}
#endif

@end
