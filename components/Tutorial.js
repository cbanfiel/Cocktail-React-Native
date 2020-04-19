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
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';

const colors = ["#ffd54f", "#66bb6a", "#4fc3f7", "#9575cd", "#ff5252"];

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const DURATION = 500;
const CARDS_UNTIL_AD_SHOWN = 7;

const TUTORIAL_STATE = {
    TAP_CARD: 0,
    NEW_CARD: 1,
    FAVORITE_CARD:2,
    UNFAVORITE_CARD:3,
    FAVORITES_MODE:4,
    FAVORITES_MODE_PART_2: 5,
    FINISHED: 6
    }

const TUTORIAL_TEXT = [
  {
  front: "This is the front of the card\n\nThe front of the card will usually display an image of the cocktail\n\nTap the card to flip it over",
  back: "This is the back of the card\n\nThe back of the card will usually display ingredients and instructions on how to make the cocktail\n\nTo fetch a new cocktail tap the make me a drink button or swipe left on the card!"
  },
   {
  front: "This is the front of the card\n\nThe front of the card will usually display an image of the cocktail\n\nTap the card to flip it over",
  back: "This is the back of the card\n\nThe back of the card will usually display ingredients and instructions on how to make the cocktail\n\nTo fetch a new cocktail tap the make me a drink button or swipe left on the card!"
  },
  {
  front: "This is the front of a brand new card\n\nThis will display the new cocktails image\n\nTo save this cocktail in your favorites list tap the heart in the bottom right corner of the card!\n\nTap the heart to add this card to your favorites list!",
  back: "This is the back of a brand new card\n\nThis will display the new cocktails ingredients and instructions\n\nTo save this cocktail in your favorites list tap the heart in the bottom right corner of the card!\n\nTap the heart to add this card to your favorites list!"
  },
  {
  front: "Congratulations!\n\nYou favorited this card!\n\nTo unfavorite the card just tap the pink heart button in the bottom right corner of the card!\n\nTap the heart again to remove it from your favorites list!",
  back: "Congratulations!\n\nYou favorited this card!\n\nTo unfavorite the card just tap the pink heart button in the bottom right corner of the card!\n\nTap the heart again to remove it from your favorites list!",
  },
  {
  front: "Okay this is the last step in your tutorial!\n\nTo view your favorited cocktails hit the heart button at the very bottom of the screen!\n\nThis button will put you into favorites mode!\n\nWhen you are in favorites mode just tap make me a drink or swipe left and it will only load drinks from your favorites list!\n\nTap the favorites mode button to go into favorites mode!",
  back: "Okay this is the last step in your tutorial!\n\nTo view your favorited cocktails hit the heart button at the very bottom of the screen!\n\nThis button will put you into favorites mode!\n\nWhen you are in favorites mode just tap make me a drink or swipe left and it will only load drinks from your favorites list!\n\nTap the favorites mode button to go into favorites mode!",
  },
  {
  front: "Awesome! You are now in favorites mode!\n\nRemember, favorites mode will only show your favorited cocktails, if you want to leave favorites mode just tap the favorites mode button again and it will take you out of favorites mode!\n\nNow that you are in favorites mode tap the next drink button or swipe left to get a card from your favorites list!\n\nTap the make me a drink button or swipe left on the card!",
  back: "Awesome! You are now in favorites mode!\n\nRemember, favorites mode will only show your favorited cocktails, if you want to leave favorites mode just tap the favorites mode button again and it will take you out of favorites mode!\n\nNow that you are in favorites mode tap the next drink button or swipe left to get a card from your favorites list!\n\nTap the make me a drink button or swipe left on the card!",
  },
  {
  front: "Since you are in favorites mode this card will display a favorited card!\n\nCongratulations! You completed the tutorial!\nPress the complete tutorial button to finish the tutorial!",
  back: "Since you are in favorites mode this card will display a favorited card!\n\nCongratulations! You completed the tutorial!\nPress the complete tutorial button to finish the tutorial!",
  },

];

export default class Tutorial extends React.Component {



  nextDrink = () => {
    if(this.state.tutorialState == TUTORIAL_STATE.FINISHED){
      this.props.endTutorial();
      return;
    }
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
     this.setState({tutorialState: TUTORIAL_STATE.FAVORITE_CARD}, () => this.setIfDisabled())
   }
   if(this.state.tutorialState == TUTORIAL_STATE.FAVORITES_MODE_PART_2){
     this.setState({tutorialState: TUTORIAL_STATE.FINISHED}, () => this.setIfDisabled())
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
          
          this.setState({loading: false, buttonDisabled: false, positionX: screenWidth * -1})
      });
    });
  };

  favoriteMode = () => {
    let favoriteMode = !this.state.favoriteMode;
    if (this.state.tutorialState == TUTORIAL_STATE.FAVORITES_MODE) {
    this.setState(
      {
        favoriteMode: favoriteMode,
        tutorialState: TUTORIAL_STATE.FAVORITES_MODE_PART_2
      }, () => this.setIfDisabled()
    );
    }
    if(this.state.tutorialState == TUTORIAL_STATE.FAVORITES_MODE_PART_2){
      this.setState(
      {
        favoriteMode: favoriteMode,
        tutorialState: TUTORIAL_STATE.FAVORITES_MODE
      }, () => this.setIfDisabled()
    );
    }

  };

  favorite = () => {
    if(this.state.tutorialState == TUTORIAL_STATE.FAVORITE_CARD){
    let liked = !this.state.liked;
    this.setState({ liked: liked, tutorialState :TUTORIAL_STATE.UNFAVORITE_CARD }, ()=> this.setIfDisabled());
    }
    if(this.state.tutorialState == TUTORIAL_STATE.UNFAVORITE_CARD){
    let liked = !this.state.liked;
    this.setState({ liked: liked, tutorialState :TUTORIAL_STATE.FAVORITES_MODE }, ()=> this.setIfDisabled());
    }

  };

    _onHorizontalFlingHandlerStateChange = ({ nativeEvent }, offset) => {
    if (nativeEvent.oldState === State.ACTIVE) {
        this.nextDrink();
    }
  };


  setIfDisabled = () => {
    if(this.state.tutorialState == TUTORIAL_STATE.TAP_CARD){
      this.setState({
        newDrinkButtonDisabled: true,
        favoritesModeButtonDisabled: true,
        addToFavoritesButtonDisabled: true
      })

    }else if(this.state.tutorialState == TUTORIAL_STATE.NEW_CARD){
       this.setState({
        newDrinkButtonDisabled: false,
        favoritesModeButtonDisabled: true,
        addToFavoritesButtonDisabled: true
      })

    }else if(this.state.tutorialState == TUTORIAL_STATE.FAVORITE_CARD){
       this.setState({
        newDrinkButtonDisabled: true,
        favoritesModeButtonDisabled: true,
        addToFavoritesButtonDisabled: false
      })

    }else if(this.state.tutorialState == TUTORIAL_STATE.UNFAVORITE_CARD){
       this.setState({
        newDrinkButtonDisabled: true,
        favoritesModeButtonDisabled: true,
        addToFavoritesButtonDisabled: false
      })

    }else if(this.state.tutorialState == TUTORIAL_STATE.FAVORITES_MODE){
       this.setState({
        newDrinkButtonDisabled: true,
        favoritesModeButtonDisabled: false,
        addToFavoritesButtonDisabled: true
      })

    }else if(this.state.tutorialState == TUTORIAL_STATE.FAVORITES_MODE_PART_2){
       this.setState({
        newDrinkButtonDisabled: false,
        favoritesModeButtonDisabled: false,
        addToFavoritesButtonDisabled: true
      })

    }
    else if(this.state.tutorialState == TUTORIAL_STATE.FINISHED){
       this.setState({
        newDrinkButtonDisabled: false,
        favoritesModeButtonDisabled: false,
        addToFavoritesButtonDisabled: true
      })

    }
  }

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
    tutorialState: TUTORIAL_STATE.TAP_CARD,
    newDrinkButtonDisabled: true,
    favoritesModeButtonDisabled: true,
    addToFavoritesButtonDisabled: true
  };

  setColorIndex = (index) => {
    this.setState({ colorIndex: index });
    FileSystem.saveToFileSystem(FileSystem.FILES.SETTINGS, {colorIndex: index}, ()=>{})
  };

  render() {
const styles = this.props.styles;

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
                            style={styles.palette}
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
                      this.setState({tutorialState: TUTORIAL_STATE.NEW_CARD}, ()=> this.setIfDisabled())
                    }
                    }
                    }
                >
               <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Tutorial\n"}</Text>
                      <Text style={styles.p}>
                      {TUTORIAL_TEXT[this.state.tutorialState].front}
                      </Text>
                      <Icon
                        reverse
                        raised
                        name="heart"
                        type="font-awesome"
                        color={this.state.addToFavoritesButtonDisabled ? '#cccccc' : this.state.liked ? "#f50057" : "#fff"}
                        iconStyle={{
                          color: this.state.addToFavoritesButtonDisabled ? '#666666' :this.state.liked ? "#fff" : "#f50057",
                        }}
                        size={verticalScale(19)}

                        containerStyle={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          margin: 10,
                        }}
                        onPress={() => this.state.addToFavoritesButtonDisabled ? null : this.favorite()}
                      />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => {
                    this.card.flip()
                  
                    }
                    }
                >
               <View style={[styles.card]}>
                      <Text style={styles.h1}>{"Tutorial\n"}</Text>
                      <Text style={styles.p}>
                       {TUTORIAL_TEXT[this.state.tutorialState].back}
                      </Text>
                     <Icon
                        reverse
                        raised
                        name="heart"
                        type="font-awesome"
                        color={this.state.addToFavoritesButtonDisabled ? '#cccccc' : this.state.liked ? "#f50057" : "#fff"}
                        iconStyle={{
                          color: this.state.addToFavoritesButtonDisabled ? '#666666' :this.state.liked ? "#fff" : "#f50057",
                        }}
                        size={verticalScale(19)}

                        containerStyle={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          margin: 10,
                        }}
                        onPress={() => this.state.addToFavoritesButtonDisabled ? null : this.favorite()}
                      />
                    </View>
         
                </TouchableOpacity>
              </CardFlip>
            </View>
          </Animated.View>
          </FlingGestureHandler> 

        </View>
        {this.state.buttonDisabled ? (
          <TouchableOpacity>
            <View style={[styles.newDrinkBtn]}>
              <ActivityIndicator></ActivityIndicator>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity disabled={this.state.newDrinkButtonDisabled}
            onPress={
              () => {
                    this.nextDrink();
                  }
            }
          >
            <View style={[styles.newDrinkBtn, this.state.newDrinkButtonDisabled ? styles.disabled : null]}>
              <Text style={[styles.newDrinkBtnTxt, this.state.newDrinkButtonDisabled ? styles.disabledText : null]}>{this.state.tutorialState == TUTORIAL_STATE.FINISHED? "complete tutorial": "make me a drink"}</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity disabled={this.state.favoritesModeButtonDisabled} onPress={() => this.favoriteMode()}>
          <View
            style={[
              styles.favoriteModeBtn,
              { backgroundColor: this.state.favoriteMode ? "#f50057" : "#fff" }, this.state.favoritesModeButtonDisabled ? styles.disabled : null
            ]}
          >
            <Icon
              name="heart"
              type="font-awesome"
              iconStyle={{
                color: this.state.favoritesModeButtonDisabled ? "#666666" : this.state.favoriteMode ? "#fff" : "#f50057",
              }}
              size={verticalScale(19)}
                  

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
