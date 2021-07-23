import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";


const MoreTabView = (props) => {

    const [moreByArtist, setMoreByArtist] = useState();

    useEffect(() => {
        let selectedArt = [];

        props.allArt.forEach(art => {
            if(art.user === props.artist && art._id !== props.artId){
                selectedArt.push(art)
            }
        })

        setMoreByArtist(selectedArt);
    },[props])


    return (
        moreByArtist ?
            <View>
                <Text Text style={styles.tabTitle}>More by Author</Text>
                <ScrollView>
                    {moreByArtist ?
                        <View style={styles.imageWrapper}>
                            {moreByArtist.map(art => {
                                return (
                                    <Image source={{ uri: art.src }} id={art._id} style={styles.image} />
                                    ||
                                    <ActivityIndicator size="large" color="white"  />
                                )
                            })}
                        </View>
                        :
                        <ActivityIndicator size="large" color="white" style={styles.activityIndicator} />
                    }
                </ScrollView>
            </View>
            :
            <ActivityIndicator size="large" color="white" style={styles.activityIndicator} />
    )
}

export default MoreTabView;

const styles = StyleSheet.create({
    tabTitle:{
        fontSize: 20,
        fontWeight: "800",
        color: "white",
        marginBottom: 40,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop:45
    },

    imageWrapper:{
        flex:1,
        flexDirection:"row",
        flexWrap:"wrap",
        width:330,
        marginLeft: "auto",
        marginRight: "auto"
    },

    image:{
        height:150,
        width:150,
        margin:5
    },

    activityIndicator: {
        marginTop: 180
    }
})