import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CardFlip from 'react-native-card-flip';

import { MonoText } from '../components/StyledText';


export default class HomeScreen extends React.Component {


  componentDidMount = () => {
    this.fetchRandomDrink();
  }

  fetchRandomDrink = () => {
    this.setState({
      loading: true
    })
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          drink: responseJson.drinks[0]
        });
        console.log(responseJson);
      })
      .catch(error => console.log(error))
  }

  state = {
    loading: true
  }

  render() {

    return (
      <View style={styles.container} >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <CardFlip style={styles.cardContainer} ref={(card) => this.card = card} >
              <TouchableOpacity style={styles.card} onPress={() => this.card.flip()} >

                {
                  this.state.loading ?

                    <ActivityIndicator size="large" color="#e0e0e0 " />
                    :

                    <Image source={{ uri: this.state.drink.strDrinkThumb }} style={{ height: '100%', width: '100%' }}></Image>
                }

              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={() => this.card.flip()} >

                {
                  this.state.loading ?

                    <ActivityIndicator size="large" color="#e0e0e0 " />

                    :
                    <View style={styles.container}>

                      <Text style={styles.h1}>{this.state.drink.strDrink}</Text>
                      <Text style={styles.p}>{this.state.drink.strInstructions}</Text>

                    </View>
                }


              </TouchableOpacity>
            </CardFlip>


          </View>
        </ScrollView>

        <Button
          onPress={() => { this.fetchRandomDrink() }}
          title="Make Me A New Drink"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />

      </View >
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  h1: {
    color: 'black',
    fontSize: 24
  },
  p: {
    color: 'black',
    fontSize: 16
  },

  cardContainer: {
    height: 500,
    width: 350,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 10,
  },
  card: {
    backgroundColor: '#fff',
    height: '100%',
    justifyContent: 'center'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
