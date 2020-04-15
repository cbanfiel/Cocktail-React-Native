import React, { Component } from "react";
import { Button } from "react-native";
import { AdMobInterstitial } from "expo-ads-admob";
export default class RewardedAd extends Component {
state = {
loadedAd: false
};
async componentDidMount() {
    AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/8691691433'); // Test ID, Replace with your-admob-unit-id
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
    await AdMobInterstitial.showAdAsync();
}
render() {
return (
null
);
}
}