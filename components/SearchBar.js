import * as React from 'react';
import { TextInput, View, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class SearchBar extends React.Component {


    state={
        open: false,
        loading: false
    }

    render() {
        return (
        
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', position:'absolute', top:20, left: 65}}>
                   <View style={{flexBasis:'65%', padding: 10, backgroundColor:'#333', margin: 10, borderRadius: 30, overflow:'hidden'}}>

                    <View style={styles.input}>
                    <TextInput
                    editable
                    maxLength={40}
                    style={{color: '#eee', fontSize: 18}}
                  />
                  </View>
                  <View style={{position:'absolute', right: -3, top:-10}}>
                <TouchableOpacity onPress={()=> this.setState({open: true})}>
                       <View style={{backgroundColor: '#ccc', borderRadius:'50%', borderWidth:0, borderColor: '#fff'}}>
                       <Image
                    source={require('../assets/images/search.png')}
                    style={{
                      width: 30,
                      height: 30,
                      margin: 20,
                      alignSelf: "center",
                      transform: [{scaleX: -1}],
                    }}
                  ></Image>
                       </View>

                </TouchableOpacity>
                   </View>
                  </View>
            </View>


        );
    }

}


const styles = StyleSheet.create({
    input: {
        padding: 5,
    }
})
