import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CardFlip from "react-native-card-flip";
import { Icon } from "react-native-elements";
import Layout from "../constants/Layout";
import { Cocktail } from "../classes/Cocktail";
import * as FileSystem from "../classes/FileSystem";
import NativeAdView from "react-native-admob-native-ads";
import { AdCard } from "../components/AdCard";
import { AdMobInterstitial } from "expo-ads-admob";
import * as config from "../config";
import ColorPalette from "../components/ColorPalette";

const colors = ["#ffd54f", "#66bb6a", "#4fc3f7", "#9575cd", "#ff5252"];

const screenWidth = Math.round(Dimensions.get("window").width);
const DURATION = 500;
const CARDS_UNTIL_AD_SHOWN = 7;

export default class HomeScreen extends React.Component {
  componentDidMount = async () => {
    FileSystem.loadFromFileSystem(FileSystem.FILES.FAVORITES, (favorites) => {
      console.log('favorites: ' + favorites);
      this.setState({ favoritesList: favorites, favoriteButtonDisabled: false });
    });
    FileSystem.loadFromFileSystem(FileSystem.FILES.SETTINGS,(settings) => {
      console.log('settings: ' + settings);
      let colorIndex = settings.colorIndex;
      this.setState({colorIndex: colorIndex})
    })
    this.fetchRandomDrink();
    this.loadAd();
  };

  showAd = async () => {
    await AdMobInterstitial.showAdAsync();
  };

  loadAd = async () => {
    try {
      AdMobInterstitial.setAdUnitID(config.interstitalAd);
      AdMobInterstitial.addEventListener("interstitialDidLoad", () => {
        this.setState({ adLoaded: true });
        console.log('ad loaded succesfully');
      });
      AdMobInterstitial.addEventListener("interstitialDidClose", async () => {
        this.setState({ adLoaded: false, showAd: false });
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      });
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    } catch (e) {
      console.log(e.message);
    }
  };

  nextDrink = () => {
    if (this.state.loading) {
      return;
    }
    this.setState({ buttonDisabled: true });
    this.slideLeft();
  };

  fetchRandomDrink = () => {
    if (this.state.drinksMade == CARDS_UNTIL_AD_SHOWN) {
      this.setState({
        showAd: true,
        drinksMade: 1,
      });
      console.log('Ad will be displayed');
    }
    console.log(this.state.drinksMade + ' drinks made');

    this.setState({
      preloaded: false,
    });
    let link = `https://www.thecocktaildb.com/api/json/v2/${config.apiKey}/random.php`;

    if (this.state.favoriteMode) {
      if(this.state.favoritesList.length == 0){
        return;
      }
      let favoritesList = this.state.favoritesList;
      let id = favoritesList[this.state.favoritesIndex];
      let newIndex = this.state.favoritesIndex + 1;
      link = `https://www.thecocktaildb.com/api/json/v2/${config.apiKey}/lookup.php?i=${id}`;

      if (newIndex >= favoritesList.length) {
        newIndex = 0;
      }
      this.setState({
        favoritesIndex: newIndex,
      });

      if (favoritesList.length < 1) {
        return;
      }
    }

    fetch(link)
      .then((response) => response.json())
      .then((responseJson) => {
        let cocktail = new Cocktail(responseJson.drinks[0]);
        Image.prefetch(cocktail.image).then(() => {
          if (this.state.cocktail === null) {
            this.setState(
              {
                loading: false,
                cocktail: cocktail,
              },
              () => {
                this.fetchRandomDrink();
              }
            );
            return;
          }
          this.setState({
            loading: false,
            preloaded: true,
            cocktail2: cocktail,
          });
        });
      })
      .catch((error) => {
        this.setState({
          loading: true,
        });
        console.log('attempting to reconnect');
        setTimeout(() => {
          this.fetchRandomDrink();
        }, 1000);
      });
  };

  slideLeft = () => {
    return Animated.parallel([
      Animated.timing(this.state.slide, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (this.state.favoriteMode && this.state.favoritesList < 1) {
        this.setState({
          emptyFavorites: true,
        });
      } else {
        if (this.state.emptyFavorites) {
          this.setState({
            emptyFavorites: false,
          });
        }
      }

      this.setState({
        cocktail: this.state.cocktail2,
        liked: this.state.favoritesList.includes(this.state.cocktail2.id),
      });
      this.fetchRandomDrink();
      this.slideIn();
    });
  };

  slideIn = () => {
    this.setState({ positionX: screenWidth }, () => {
      return Animated.parallel([
        Animated.timing(this.state.slide, {
          toValue: 0,
          duration: DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        let drinksMade = this.state.drinksMade + 1;
        if (this.state.favoriteMode && this.state.emptyFavorites) {
          //just so u dont get ads after seeing the test card
          drinksMade--;
        }

        this.setState({
          positionX: screenWidth * -1,
          buttonDisabled: false,
          drinksMade: drinksMade,
        });

        if (this.state.buttonDisabled) {
          setTimeout(() => {
            this.setState({ buttonDisabled: false });
          }, 5000);
        }
      });
    });
  };

  favoriteMode = () => {
    if (this.state.favoriteButtonDisabled) {
      return;
    }
    let favoriteMode = !this.state.favoriteMode;
    this.setState(
      {
        favoriteMode: favoriteMode,
      },
      () => {
        this.fetchRandomDrink();
      }
    );
  };

  favorite = () => {
    let liked = !this.state.liked;
    let favoritesList = this.state.favoritesList;
    if (liked) {
      favoritesList.push(this.state.cocktail.id);
    } else {
      favoritesList.splice(favoritesList.indexOf(this.state.cocktail.id), 1);
    }
    FileSystem.saveToFileSystem(FileSystem.FILES.FAVORITES, favoritesList, () => {
      FileSystem.loadFromFileSystem(FileSystem.FILES.FAVORITES, (favorites) => {
        console.log(favorites);
        this.setState({ favoritesList: favorites, favoriteButtonDisabled: false });
      });
    });

    this.setState({ liked: liked });
  };

  state = {
    slide: new Animated.Value(0),
    loading: true,
    liked: false,
    preloaded: false,
    positionX: screenWidth * -1,
    favoritesIndex: 0,
    cocktail: null,
    favoriteMode: false,
    isNextLiked: false,
    favoriteButtonDisabled: true,
    drinksMade: 2,
    colorIndex: 0,
    favoritesList: []
  };

  setColorIndex = (index) => {
    this.setState({ colorIndex: index });
    FileSystem.saveToFileSystem(FileSystem.FILES.SETTINGS, {colorIndex: index}, ()=>{})
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors[this.state.colorIndex] },
        ]}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: colors[this.state.colorIndex] },
          ]}
          contentContainerStyle={styles.contentContainer}
        >
          <ColorPalette
            colors={colors}
            colorIndex={this.state.colorIndex}
            setColorIndex={this.setColorIndex}
          />

          <Animated.View
            style={{
              transform: [
                {
                  translateX: this.state.slide.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, this.state.positionX],
                  }),
                },
              ],
            }}
          >
            <View style={styles.welcomeContainer}>
              <CardFlip
                style={styles.cardContainer}
                ref={(card) => (this.card = card)}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => this.card.flip()}
                >
                  {this.state.loading ? (
                    <View style={styles.activityIndicator}>
                      <ActivityIndicator size="large" color="#e0e0e0 " />
                    </View>
                  ) : this.state.emptyFavorites ? (
                    <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Favorites List\n"}</Text>
                      <Text style={styles.p}>
                        {
                          "Currently you have no favorited items!\n\nHit the heart in the bottom corner of a drink card to add it to your favorites list!"
                        }
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Image
                        source={{ uri: this.state.cocktail.image }}
                        style={{ height: "100%", width: "100%" }}
                      ></Image>

                      <Icon
                        reverse
                        raised
                        name="heart"
                        type="font-awesome"
                        color={this.state.liked ? "#f50057" : "#fff"}
                        iconStyle={{
                          color: this.state.liked ? "#fff" : "#f50057",
                        }}
                        containerStyle={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          margin: 10,
                        }}
                        onPress={() => this.favorite()}
                      />
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => this.card.flip()}
                >
                  {this.state.loading ? (
                    <View style={styles.activityIndicator}>
                      <ActivityIndicator size="large" color="#e0e0e0 " />
                    </View>
                  ) : this.state.emptyFavorites ? (
                    <View style={styles.card}>
                      <Text style={styles.h1}>{"Favorites List\n"}</Text>
                      <Text style={styles.p}>
                        {
                          "Currently you have no favorited items!\n\nHit the heart in the bottom corner of a drink card to add it to your favorites list!"
                        }
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.card}>
                      <Text style={styles.h1}>{this.state.cocktail.name}</Text>
                      <View
                        style={{ borderBottomWidth: 0.5, margin: 5 }}
                      ></View>

                      <Text style={styles.p}>
                        {this.state.cocktail.getIngredients()}
                      </Text>

                      <Text style={styles.p}>
                        {this.state.cocktail.instructions + "\n"}
                      </Text>

                      <Text style={styles.p}>
                        {this.state.cocktail.getGlassString() + "\n"}
                      </Text>
                      <Text style={styles.p}>
                        {this.state.cocktail.getCategoryString()}
                      </Text>

                      <Icon
                        reverse
                        raised
                        name="heart"
                        type="font-awesome"
                        color={this.state.liked ? "#f50057" : "#fff"}
                        iconStyle={{
                          color: this.state.liked ? "#fff" : "#f50057",
                        }}
                        containerStyle={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          margin: 10,
                        }}
                        onPress={() => this.favorite()}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </CardFlip>
            </View>
          </Animated.View>
        </View>
        {this.state.buttonDisabled ? (
          <TouchableOpacity>
            <View style={styles.newDrinkBtn}>
              <ActivityIndicator></ActivityIndicator>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={
              this.state.adLoaded && this.state.showAd
                ? () => this.showAd()
                : () => {
                    this.nextDrink();
                  }
            }
          >
            <View style={styles.newDrinkBtn}>
              <Text style={styles.newDrinkBtnTxt}>{"make me a drink"}</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => this.favoriteMode()}>
          <View
            style={[
              styles.favoriteModeBtn,
              { backgroundColor: this.state.favoriteMode ? "#f50057" : "#fff" },
            ]}
          >
            <Icon
              name="heart"
              type="font-awesome"
              iconStyle={{
                color: this.state.favoriteMode ? "#fff" : "#f50057",
              }}
              containerStyle={{}}
            />
            <Text style={styles.newDrinkBtnTxt}>{}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  ad: {
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    paddingTop: 30,
    padding: 10,
    flexDirection: "column",
    paddingBottom: 30,
  },
  favoriteModeBtn: {
    flexDirection: "row",
    marginBottom: 30,
    backgroundColor: "#fefefe",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    alignSelf: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  activityIndicator: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  newDrinkBtn: {
    marginBottom: 30,
    backgroundColor: "#fefefe",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    alignSelf: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  newDrinkBtnTxt: {
    fontFamily: "merriweather-light",
    fontSize: 18,
    textAlign: "center",
    color: "#42a5f5",
  },
  h1: {
    color: "black",
    fontSize: 18,
    fontFamily: "merriweather-light",
  },
  p: {
    color: "black",
    fontSize: 14,
    fontFamily: "merriweather-light",
  },

  cardContainer: {
    marginTop: 40,
    height: 500,
    width: 350,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 10,
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center",
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
