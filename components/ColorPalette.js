import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class ColorPalette extends React.Component {
    render() {
        const { colors, colorIndex, setColorIndex, style } = this.props;
        const colorSize = style.height * 0.67;
        return (
            <View style={style}>

                {
                    colors.map((color, i) => {
                        return (
                            <TouchableOpacity containerStyle={{ alignSelf: 'center' }} onPress={() => setColorIndex(i)} key={i}>
                                <View style={{ backgroundColor: color, height: colorSize, width: colorSize, borderRadius: colorSize/2, borderWidth: i == colorIndex ? 2 : 0, borderColor: 'white' }}>
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

})
