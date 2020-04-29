import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import useLinking from './navigation/useLinking';
import HomeScreen from './screens/HomeScreen';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        //disable text scaling
        Text.defaultProps = Text.defaultProps || {};
        Text.defaultProps.allowFontScaling = false;

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'merriweather-light': require('./assets/fonts/Merriweather-Light.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        <HomeScreen></HomeScreen>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
