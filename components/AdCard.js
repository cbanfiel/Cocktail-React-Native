import * as React from 'react';
import { View } from 'react-native';
import { AdMobBanner } from 'expo-ads-admob';
import * as config from '../config';

export function AdCard({ style }) {
    return (
        <View style={style}>
            <AdMobBanner
                style={{ margin: 10 }}
                bannerSize="mediumRectangle"
                adUnitID={config.largeCardBanner}
                servePersonalizedAds={true}
                onDidFailToReceiveAdWithError={(err) => { console.log("ERROR: " + err) }}
            />

            <AdMobBanner
                style={{ margin: 10 }}
                bannerSize="largeBanner"
                adUnitID={config.smallCardBanner}
                servePersonalizedAds={true}
                onDidFailToReceiveAdWithError={(err) => { console.log("ERROR: " + err) }}
            />

        </View>
    )
}
