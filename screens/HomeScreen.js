import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CardFlip from 'react-native-card-flip';
import { Icon } from 'react-native-elements'


class Cocktail {
  constructor(json) {
    this.name = json.strDrink;
    this.category = json.strCategory;
    this.isAlcholic = json.strAlcohlic;
    this.glassType = json.strGlass;
    this.image = json.strDrinkThumb;
    this.instructions = json.strInstructions;
    this.ingredients = [];
    this.ingredients.push({ ingredient: json.strIngredient1, measurement: json.strMeasure1 });
    this.ingredients.push({ ingredient: json.strIngredient2, measurement: json.strMeasure2 });
    this.ingredients.push({ ingredient: json.strIngredient3, measurement: json.strMeasure3 });
    this.ingredients.push({ ingredient: json.strIngredient4, measurement: json.strMeasure4 });
    this.ingredients.push({ ingredient: json.strIngredient5, measurement: json.strMeasure5 });
    this.ingredients.push({ ingredient: json.strIngredient6, measurement: json.strMeasure6 });
    this.ingredients.push({ ingredient: json.strIngredient7, measurement: json.strMeasure7 });
    this.ingredients.push({ ingredient: json.strIngredient8, measurement: json.strMeasure8 });
    this.ingredients.push({ ingredient: json.strIngredient9, measurement: json.strMeasure9 });
    this.ingredients.push({ ingredient: json.strIngredient10, measurement: json.strMeasure10 });
    this.ingredients.push({ ingredient: json.strIngredient11, measurement: json.strMeasure11 });
    this.ingredients.push({ ingredient: json.strIngredient12, measurement: json.strMeasure12 });
    this.ingredients.push({ ingredient: json.strIngredient13, measurement: json.strMeasure13 });
    this.ingredients.push({ ingredient: json.strIngredient14, measurement: json.strMeasure14 });
    this.ingredients.push({ ingredient: json.strIngredient15, measurement: json.strMeasure15 });


  }

  getIngredients() {
    let str = '';
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].measurement != null) {
        str += ` ${this.ingredients[i].measurement}`;
      }

      if (this.ingredients[i].ingredient != null) {
        str += ` ${this.ingredients[i].ingredient}\n`;
      } else {
        break;
      }
    }
    return str;
  }

  getGlassString() {
    return `You would typically enjoy this drink in a ${this.glassType}`
  }

  getCategoryString() {
    return `Category: ${this.category}`;
  }



}


export default class HomeScreen extends React.Component {


  componentDidMount = () => {
    this.fetchRandomDrink();
  }

  fetchRandomDrink = () => {
    this.setState({
      loading: true,
      liked: false
    })
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then(response => response.json())
      .then((responseJson) => {


        let cocktail = new Cocktail(responseJson.drinks[0]);

        this.setState({
          loading: false,
          cocktail: cocktail
        });
      })
      .catch(error => console.log(error))
  }

  state = {
    loading: true,
    liked: false
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
                    <View>

                      <Image source={{ uri: this.state.cocktail.image }} style={{ height: '100%', width: '100%' }}></Image>

                      <Icon
                        reverse
                        raised
                        name='heart'
                        type='font-awesome'
                        color={this.state.liked ? '#f50057' : '#fff'}
                        iconStyle={{ color: this.state.liked ? '#fff' : '#f50057' }}
                        containerStyle={{ position: 'absolute', bottom: 0, right: 0, margin: 10 }}
                        onPress={() => this.setState({ liked: !this.state.liked })} />

                    </View>
                }

              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={() => this.card.flip()} >

                {
                  this.state.loading ?

                    <ActivityIndicator size="large" color="#e0e0e0 " />

                    :
                    <View style={styles.container}>


                      <Text style={styles.h1}>{this.state.cocktail.name}</Text>
                      <View style={{ borderBottomWidth: 0.5, margin: 5 }}>

                      </View>



                      <Text style={styles.p}>{this.state.cocktail.getIngredients()}</Text>

                      <Text style={styles.p}>{this.state.cocktail.instructions}</Text>

                      <Text style={styles.p}>{this.state.cocktail.getGlassString()}</Text>
                      <Text style={styles.p}>{this.state.cocktail.getCategoryString()}</Text>

                      <Icon
                        reverse
                        raised
                        name='heart'
                        type='font-awesome'
                        color={this.state.liked ? '#f50057' : '#fff'}
                        iconStyle={{ color: this.state.liked ? '#fff' : '#f50057' }}
                        containerStyle={{ position: 'absolute', bottom: 0, right: 0, margin: 10 }}
                        onPress={() => this.setState({ liked: !this.state.liked })} />

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
  btn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 75,
    backgroundColor: '#ec407a',
    borderRadius: 50,
    bottom: 0,
    right: 0,
    margin: 20
  },
  h1: {
    color: 'black',
    fontSize: 24,
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
    backgroundColor: '#fafafa',
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden'
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
