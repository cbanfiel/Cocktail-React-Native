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

import {
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';

const colors = ["#ffd54f", "#66bb6a", "#4fc3f7", "#9575cd", "#ff5252"];

const screenWidth = Math.round(Dimensions.get("window").width);
const DURATION = 500;
const CARDS_UNTIL_AD_SHOWN = 7;


const TUTORIAL_STATE = {
    TAP_CARD: 1,
    NEW_CARD:2,
    FAVORITE_CARD:3,
    UNFAVORITE_CARD:4,
    FAVORITES_MODE:5
    }

export default class Tutorial extends React.Component {
  componentDidMount = async () => {

  };

  nextDrink = () => {
    if (this.state.loading) {
      return;
    }
    this.setState({ buttonDisabled: true });
    this.slideLeft();
  };

  slideLeft = () => {
    return Animated.parallel([
      Animated.timing(this.state.slide, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
   if(this.state.tutorialState == TUTORIAL_STATE.NEW_CARD){
     this.setState({tutorialState: TUTORIAL_STATE.FAVORITE_CARD})
   }
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
          this.setState({loading: false})
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
    if(this.state.tutorialState == TUTORIAL_STATE.FAVORITE_CARD){
    let liked = !this.state.liked;
    this.setState({ liked: liked, tutorialState :TUTORIAL_STATE.UNFAVORITE_CARD });
    }
    if(this.state.tutorialState == TUTORIAL_STATE.UNFAVORITE_CARD){
    let liked = !this.state.liked;
    this.setState({ liked: liked, tutorialState :TUTORIAL_STATE.FAVORITES_MODE });
    }

  };

    _onHorizontalFlingHandlerStateChange = ({ nativeEvent }, offset) => {
    if (nativeEvent.oldState === State.ACTIVE) {
        this.nextDrink();
    }
  };

  state = {
    slide: new Animated.Value(0),
    loading: false,
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
    favoritesList: [],
    tutorialState: TUTORIAL_STATE.TAP_CARD
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
                            style={[styles.palette, {opacity: 0}]}

            colors={colors}
            colorIndex={this.state.colorIndex}
            setColorIndex={this.setColorIndex}
          />

          <FlingGestureHandler   direction={Directions.LEFT}
          onHandlerStateChange={ev =>
            this._onHorizontalFlingHandlerStateChange(ev, -10)
          }> 

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
            <View style={styles.centerCardContainer}>

              <CardFlip
                style={styles.cardContainer}
                ref={(card) => (this.card = card)}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    this.card.flip()
                    if(this.state.tutorialState == TUTORIAL_STATE.TAP_CARD){
                      this.setState({tutorialState: TUTORIAL_STATE.NEW_CARD})
                    }
                    }
                    }
                >
                  {this.state.tutorialState <= TUTORIAL_STATE.NEW_CARD ? (
                      <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Tutorial\n"}</Text>
                      <Text style={styles.p}>
                        {
                          "This is the front of the card\n\nThe front of the card will usually display an image of the cocktail\n\nTap the card to flip it over"
                        }
                      </Text>
                    </View>
                  ) : this.state.tutorialState == TUTORIAL_STATE.FAVORITE_CARD ? (
               <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Tutorial\n"}</Text>
                      <Text style={styles.p}>
                        {
                          "This is the front of a brand new card\n\nThis will display the new cocktails image\n\nTo save this cocktail in your favorites list tap the heart in the bottom right corner of the card!\n\nTap the heart!"
                        }
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
                  ) : this.state.tutorialState == TUTORIAL_STATE.UNFAVORITE_CARD ? (
               <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Tutorial\n"}</Text>
                      <Text style={styles.p}>
                        {
                          "Congratulations!\n\nYou favorited this card!\n\nTo unfavorite the card just tap the pink heart button in the bottom right corner of the card!\n\nTap the heart again to remove it from your favorites list!"
                        }
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
                  ) :  this.state.tutorialState == TUTORIAL_STATE.FAVORITES_MODE ? (
               <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Tutorial\n"}</Text>
                      <Text style={styles.p}>
                        {
                          "Okay this is the last step in your tutorial!\n\nTo view your favorited cocktails hit the heart button at the very bottom of the screen!\n\nThis button will put you into favorites mode!\n\nWhen you are in favorites mode just tap make me a drink or swipe left on the card and it will only load drinks from your favorites list!\n\nTap the favorites mode button"
                        }
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
                 {this.state.tutorialState <= TUTORIAL_STATE.NEW_CARD ? (
                      <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Tutorial\n"}</Text>
                      <Text style={styles.p}>
                        {
                          "This is the back of the card\n\nThe back of the card will usually display ingredients and instructions on how to make the cocktail\n\nTo fetch a new cocktail tap the make me a drink button or swipe left on the card!"
                        }
                      </Text>
                    </View>
                  ) : this.state.tutorialState == TUTORIAL_STATE.FAVORITE_CARD ? (
               <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Tutorial\n"}</Text>
                      <Text style={styles.p}>
                        {
                          "This is the back of a brand new card\n\nThis will display the new cocktails ingredients and instructions\n\nTo save this cocktail in your favorites list tap the heart in the bottom right corner of the card!\n\nTap the heart!"
                        }
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
                  ) : this.state.tutorialState == TUTORIAL_STATE.UNFAVORITE_CARD ? (
               <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Tutorial\n"}</Text>
                      <Text style={styles.p}>
                        {
                          "Congratulations!\n\nYou favorited this card!\n\nTo unfavorite the card just tap the pink heart button in the bottom right corner of the card!\n\nTap the heart again to remove it from your favorites list!"
                        }
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
                  ): (
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
          </FlingGestureHandler> 

        </View>
        {this.state.buttonDisabled ? (
          <TouchableOpacity>
            <View style={[styles.newDrinkBtn, {opacity: this.state.tutorialState < TUTORIAL_STATE.NEW_CARD ? 0 : 100}]}>
              <ActivityIndicator></ActivityIndicator>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={
              () => {
                    if(this.state.tutorialState != TUTORIAL_STATE.NEW_CARD){
                      return;
                    }
                    this.nextDrink();
                  }
            }
          >
            <View style={[styles.newDrinkBtn, {opacity: this.state.tutorialState < TUTORIAL_STATE.NEW_CARD ? 0 : 100}]}>
              <Text style={styles.newDrinkBtnTxt}>{"make me a drink"}</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => this.favoriteMode()}>
          <View
            style={[
              styles.favoriteModeBtn,
              { backgroundColor: this.state.favoriteMode ? "#f50057" : "#fff" }, {opacity: this.state.tutorialState < TUTORIAL_STATE.FAVORITES_MODE ? 0 : 100}
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

Tutorial.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    padding: 10,
    flexDirection: "column",
    paddingBottom: 30,
  },      palette: {
        backgroundColor: '#212121',
        height: 45,
        width: 235,
        borderRadius: 25,
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
  favoriteModeBtn: {
    flexDirection: "row",
    marginBottom: 30,
    backgroundColor: "#fefefe",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 235,
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
    width: 235,
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
  contentContainer: {
    paddingTop: 30,
  },
  centerCardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: '8%',
    marginBottom: 20,
  }
});
