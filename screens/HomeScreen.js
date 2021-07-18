import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useArtContext } from '../utils/GlobalState';
import { getAllArt, getArtist } from '../utils/API';
import { FaRegCommentAlt } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';

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

    console.log(art)

    return(
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {art? art.map(art => {
                    return(
                        <View>
                            <Image source={art.src} style={styles.image} />
                            <View style={styles.imageConsole}>
                                <Text style={styles.titleText}>{art.title}</Text>
                                <View style={styles.comments}><FaRegCommentAlt size={20}  /></View>
                                <View style={styles.favorite}><AiOutlineStar size={20}  /></View>
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
        height:300,
        width:300,
        marginLeft: "auto",
        marginRight: "auto",
        marginTop:20,
        opacity:0.9
    },

    imageConsole:{
        marginLeft: "auto",
        marginRight: "auto",
        borderStyle:"solid",
        borderColor:"white",
        position:"relative"
    },

    titleText:{
        color:"white",
        position:"absolute",
        right:43,
        width:100,
        bottom:20,
        fontWeight:949
    },

    comments:{
        color:"white",
        position: "absolute",
        width:40,
        left:120,
        bottom:40
    },

    favorite:{
        color: "white",
        position: "absolute",
        width: 40,
        left: 120,
        bottom: 10
    }
});