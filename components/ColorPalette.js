import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class ColorPalette extends React.Component {
    render() {
        const { colors, colorIndex, setColorIndex } = this.props;
        return (
            <View style={styles.palette}>

                {
                    colors.map((color, i) => {
                        return (
                            <TouchableOpacity containerStyle={{ alignSelf: 'center' }} onPress={() => setColorIndex(i)} key={i}>
                                <View style={{ backgroundColor: color, height: 30, width: 30, borderRadius: 15, borderWidth: i == colorIndex ? 2 : 0, borderColor: 'white' }}>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }


            </View>



        );
    }

}


const styles = StyleSheet.create({
    palette: {
        backgroundColor: '#212121',
        height: 45,
        width: '60%',
        borderRadius: 25,
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
})
