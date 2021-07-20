import React, { useState } from "react"
import { StyleSheet, Text, View, } from 'react-native';
import { Button } from 'react-native-elements'
import { Picker } from '@react-native-picker/picker';

const ReportTabView = () => {
    const [selectedLanguage, setSelectedLanguage] = useState();

    return(
        <View>
            <Text style={styles.tabTitle}>Report Tab</Text>
            <Picker
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedLanguage(itemValue)
                }
                style={styles.picker}
            >
                <Picker.Item label="Inappropriate" value="Inappropriate" color="white" />
                <Picker.Item label="Offensive" value="Offensive" color="white" />
                <Picker.Item label="Dont want to see like that" value="Dont want to see like that" color="white" />
            </Picker>
            <Button 
                title="Report" 
                type="solid" 
                buttonStyle={{ backgroundColor:"#ff5148"}} 
                titleStyle={{fontWeight:"500"}} raised
            />
        </View>
    )
}

export default ReportTabView;

const styles = StyleSheet.create({

    tabTitle:{
        fontSize: 20,
        fontWeight: "800",
        color: "white",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 45
    },

    picker:{
        width:300,
        marginTop:-50
    }

})