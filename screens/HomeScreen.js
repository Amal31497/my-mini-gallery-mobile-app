import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useArtContext } from '../utils/GlobalState';
import { getAllArt, getArtist } from '../utils/API';
import { Entypo, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import Moment from 'react-moment';
import axios from "axios";


const FindArtistAvatar = (props) => {
    const [foundArtist, setFoundArtist] = useState();

    useEffect(() => {
        getArtist(props.id)
            .then(response => {
                if(response.data.avatar){
                    setFoundArtist(response.data.avatar.avatarSrc)
                } else {
                    setFoundArtist("#")
                }
            })
            .catch(error => console.log(error))
    },[]);

    return(
        <Image source={{uri:foundArtist}} style={{width:35,height:35}}/>
    )
}

const FindArtist = (props) => {
    const [foundArtist, setFoundArtist] = useState();
    useEffect(() => {
        getArtist(props.id)
            .then(response => {
                setFoundArtist(response.data.username)
            })
            .catch(error => console.log(error))
    },[])
    
    return(
        <Text style={{color:"white"}}>{foundArtist}</Text>
    );
}

const HomeScreen = ({ navigation }) => {

    const [state, dispatch] = useArtContext();
    const [art, setArt] = useState();


    useEffect(() => {
        getAllArt()
            .then(response => {
                setArt(response.data)
            })
            .catch(error => alert(error))
    },[])
    
    return(
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {
                    art ? art.map(art => {
                        return (
                            <View key={art._id}>
                                <View style={styles.topConsole}>
                                    <View style={styles.topConsoleLeft}>
                                        <FindArtistAvatar style={styles.avatarImage} id={art.user} />
                                        <View>
                                            <Text style={styles.titleText}>{art.title}</Text>
                                            <Text style={{ color: "white" }}>by <FindArtist id={art.user} /></Text>
                                        </View>
                                    </View>

                                    <Entypo style={styles.more} name="dots-three-horizontal" size={22} color="white" />
                                </View>
                                
                                <Image key={art._id} source={{ uri: art.src }} 
                                    style={{
                                        height:art.height*0.35,
                                        width:art.height*0.35,
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        marginTop: 10,
                                        marginBottom: 10
                                    }} 
                                />
                                <View style={styles.bottomConsole}>
                                    <View style={styles.savedFavorite}>
                                        <AntDesign name="staro" size={22} color="white" />
                                        <Text style={{ color: "white", fontSize:16 }}>{art.savedFavorite}</Text>
                                    </View>
                                    <Moment element={Text} fromNow style={{ color: "white" }}>
                                        {art.date}
                                    </Moment>
                                    <View style={styles.savedFavorite}>
                                        <FontAwesome5 name="comments" size={22} color="white" />
                                        <Text style={{ color: "white", fontSize: 16 }}>{art.comments.length}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                        :
                        null
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"black"
    },

    image:{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop:10,
        marginBottom:10
    },

    imageConsole:{
        marginLeft: "auto",
        marginRight: "auto",
        borderStyle:"solid",
        borderColor:"white"
    },

    topConsole:{
        flexDirection: "row",
        justifyContent:"space-between",
        marginLeft: "auto",
        marginRight: "auto",
        width:355,
    },

    topConsoleLeft:{
        flexDirection:"row"
    },

    bottomConsole:{
        flexDirection:"row",
        marginBottom:50,
        marginLeft: "auto",
        marginRight: "auto",
        justifyContent: "space-between",
        alignItems:"center",
        width: 355,
    },

    titleText:{
        color:"white"
    },

    avatarImage:{
        width:40,
        height:40
    },

    savedFavorite:{
        flexDirection: "row",
        width:60,
        justifyContent:"space-evenly",
        alignItems:"center"
    }

});