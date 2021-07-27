import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, Image, Button, ActivityIndicator } from 'react-native';
import Moment from 'react-moment';
import { getArtist } from '../../utils/API';

const ArtInfoTabView = (props) => {

    const art = props.art
    const artist = props.user
    // const [artist, setArtist] = useState();
    // useEffect(() => {
    //     if (art) {
    //         getArtist(art.user)
    //             .then(response => {
    //                 setArtist(response.data)
    //             })
    //             .catch(error => alert("Could not find an artist for this posting :("))
    //     }
    // }, [art])

    return (
        (artist && art) ?
            <View style={styles.infoTabContainer}>
                <Text style={styles.tabTitle}>About Art</Text>
                <View style={styles.infoSection}>
                    <Image source={{ uri: artist.avatar ? artist.avatar.avatarSrc : "https://picsum.photos/id/1025/200/200" }} style={styles.avatar} />
                    <View>
                        <Text style={styles.infoTextTitle}>{art.title}</Text>
                        <Text style={styles.infoText}>by {artist ? artist.username : null} on {" "}
                            <Moment element={Text} format="MMMM DD">
                                {art.date}
                            </Moment>
                        </Text>
                        <Text style={styles.infoText}>{art.genre}</Text>
                        <Text style={styles.infoText}>{art.height}x{art.width}</Text>
                    </View>
                </View>

                <View style={styles.tags}>
                    {art.tags && art.tags.map(tag => {
                        return (
                            <Button key={tag} title={tag} style={styles.tag} />
                        )
                    })}
                </View>

                <View>
                    <Text style={styles.descriptionText}>{art.description}</Text>
                </View>
            </View>
            :
            <ActivityIndicator size="large" color="white" style={styles.activityIndicator} />
    )
}

export default ArtInfoTabView;

const styles = StyleSheet.create({
    infoTabContainer:{
        marginTop:45
    },

    infoSection:{
        flexDirection:"row"
    },

    avatar:{
        height:110,
        width:110
    },

    tabTitle:{
        fontSize: 20,
        fontWeight: "800",
        color: "white",
        marginBottom: 40,
        marginLeft: "auto",
        marginRight:"auto"
    },

    infoTextTitle:{
        fontSize: 16, 
        fontWeight: "800", 
        color: "white", 
        marginBottom: 20,
        marginLeft:30
    },

    infoText:{
        color:"white",
        marginBottom:10,
        marginLeft: 30
    },

    tags:{
        flex:1,
        flexDirection:"row",
        flexWrap: "wrap",
        justifyContent:"center",
        marginTop:30,
        marginBottom:30
    },

    descriptionText:{
        color:"white",
        width:300,
        marginLeft:"auto",
        marginRight:"auto"
    },

    activityIndicator:{
        marginTop:180
    }
})