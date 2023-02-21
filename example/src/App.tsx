import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { addScreenCaptureListener } from 'react-native-ntl-screen-capture';

export default function App() {
  const [result, setResult] = React.useState<boolean>(false);

  React.useEffect(() => {
    const unsub = addScreenCaptureListener(doSomething);
    return () => {
      unsub();
    };
  }, []);

  const doSomething = (params: boolean) => {
    console.log('capture: ', params);
    setResult(params);
  };

  return (
    <View style={styles.container}>
      <Text>Result: {result ? 'true' : 'false'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
