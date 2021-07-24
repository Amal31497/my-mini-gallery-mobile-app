import React, { useLayoutEffect, useEffect, useState, useRef } from "react";

import { StyleSheet, Text, View, Image, Modal, FlatList, 
        TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useArtContext } from '../utils/GlobalState';
import { getAllArt, getArtist, logout, addNewFavoriteArt, updateArt } from '../utils/API';
import { LOGOUT } from "../utils/actions";
import { Entypo, AntDesign, FontAwesome5, Octicons, Ionicons } from '@expo/vector-icons';
import Moment from 'react-moment';

import ArtInfoTabView from "./HomeBottomConsoleTabViews/ArtInfoTabView";
import CommentTabView from "./HomeBottomConsoleTabViews/CommentTabView";
import MoreTabView from "./HomeBottomConsoleTabViews/MoreTabView";
import ReportTabView from "./HomeBottomConsoleTabViews/ReportTabView";

const FindArtistAvatar = (props) => {
    const [foundArtist, setFoundArtist] = useState();

    useEffect(() => {
        getArtist(props.id)
            .then(response => {
                if (response.data.avatar) {
                    setFoundArtist(response.data.avatar.avatarSrc)
                }
            })
            .catch(error => alert(error))
    }, []);

    return (
        <Image source={{ uri: foundArtist }} style={{ width: 35, height: 35 }} />     
    )
}

const FindArtist = (props) => {
    const [foundArtist, setFoundArtist] = useState();

    useEffect(() => {
        getArtist(props.id)
            .then(response => {
                setFoundArtist(response.data.username)
            })
            .catch(error => alert(error))
    }, [])

    return (
        <Text style={{ color: "white" }}>{foundArtist}</Text>
    );
}

const FindArtistFavorite = (props) => {
    const [foundArtist, setFoundArtist] = useState();
    const [selectedFavoriteId, setSelectedFavoriteId] = useState();
    const [state, dispatch] = useArtContext();

    const findArtist = () => {
        getArtist(state.user)
            .then(response => {
                setFoundArtist(response.data.favorites.includes(props.artId))
            })
            .catch(error => alert("Something went wrong!"))
    }

    useEffect(() => {
        findArtist();
    },[props.id, props.artId, selectedFavoriteId])

    const addToFavorites = (event, artId ) => {
        event.preventDefault();

        addNewFavoriteArt(state.user, {favorite: artId})
            .then(response => {
                findArtist();
                updateArt(artId, { savedFavorite: 1 });
            })
            .catch(error => alert("Something went wrong!"))
    }

    return(
        foundArtist === true ?
            <AntDesign name="star" size={22} color="white" />
            :
            <AntDesign name="staro" size={22} color="white" onPress={(event) => addToFavorites(event, props.artId)}  />
    )
}

const HomeScreen = ({ navigation }) => {
    const [state, dispatch] = useArtContext();
    const [query, setQuery] = useState("");
    const [genreQuery, setGenreQuery] = useState("");
    const [art, setArt] = useState([]);
    const [originalArt, setOriginalArt] = useState([]);
    const [filteredArt, setFilteredArt] = useState([]);
    const [consoleModal, setConsoleModal] = useState(false);
    const [rightModal, setRightModal] = useState(false);
    const [selectedArt, setSelectedArt] = useState({});
    const [selectedTab, setSelectedTab] = useState("infoTab");
    const genres = ["3D", "AnimeandManga", "ArtisanCraft", "Comic", "DigitalArt", "TraditionalArt", "Customization", "Cosplay", "Fantasy", "FanArt", "PhotoManipulation", "Photography"]
    const scrollRef = useRef(null);

    const handleLogout = (event) => {
        event.preventDefault()
        
        logout()
            .then(response => {
                dispatch({
                    type: LOGOUT,
                    user: {}
                })
                navigation.replace("Login")
            })
            .catch(error => alert(error))
    }

    const checkoutProfile = (event) => {
        event.preventDefault();

        navigation.replace("Profile")
    }

    const checkoutHome = (event) => {
        event.preventDefault();
    }


    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle:{ backgroundColor:"rgb(53,58,63)" },
            headerTitleStyle:{ color:"white" },
            headerRight: () => {
                return (
                    <View>
                        <AntDesign name="logout" size={24} color="white" style={{ marginRight: 20 }} onPress={handleLogout} />
                    </View>
                )
            },
            headerLeft: () => {
                return (
                    <View>
                        <Entypo name="menu" size={32} color="white" style={{marginLeft:30}} />
                    </View>
                )
            }
        })
    }, [navigation])

    useEffect(() => {

        if (!state.user.length) {
            navigation.replace("Login")
        }

        getAllArt()
            .then(response => {
                setArt(response.data)
                setOriginalArt(response.data)
            })
            .catch(error => alert(error))
        
        setTimeout(() => {
            if (art !== undefined) {
                if (query.length > 0 || genreQuery.length > 0) {
                    let filteredData = [];
                    art.forEach(art => {
                        if (query && genreQuery) {
                            if (art.tags.includes(query.toLowerCase()) && art.genre === genreQuery) filteredData.push(art);
                        } else if (query) {
                            if (art.tags.includes(query.toLowerCase())) filteredData.push(art);
                        } else if (genreQuery) {
                            if (art.genre === genreQuery) filteredData.push(art)
                        }
                    })
                    setFilteredArt(filteredData)
                } else {
                    setFilteredArt(originalArt)
                }
            }
        },2000)

    }, [query, genreQuery, selectedArt, art])

    return (
        <SafeAreaView style={styles.container}>

            {/* Genre Section */}
            <View style={{ flexDirection: "row" }}>
                <AntDesign name="close" size={36} color="white" style={styles.dropGenreSelection} onPress={() => {setFilteredArt([]), setGenreQuery("")}} />
                <ScrollView style={styles.genreSection} horizontal={true}>
                    {genres.map(genre => {
                        return (
                            <Button key={genre} title={genre} type="outline" buttonStyle={genre === genreQuery ? styles.genreButtonSelected : styles.genreButton} titleStyle={genre === genreQuery ? styles.genreButtonTitleSelected : styles.genreButtonTitleStyle} onPress={() => { setFilteredArt([]), setGenreQuery(genre) }} />
                        )
                    })}
                </ScrollView>
            </View> 

            {/* Search Section */}
            <View style={styles.searchSection}>
                <Text style={styles.resultsFoundText}>{(query || genreQuery) ? filteredArt.length : art.length} results</Text>
                <View style={styles.searchSectionSearchBar}>
                    <AntDesign name="search1" size={20} color="grey" style={styles.searchIcon} />
                    <Input
                        placeholder="Search"
                        style={styles.searchInput}
                        value={query}
                        onChangeText={(text) => {setFilteredArt([]), setQuery(text)}}
                    />
                    <AntDesign name="close" size={20} color="grey" style={styles.dropSearchIcon} onPress={() => setQuery("")} />
                </View>
            </View>
            
            {/* Main Section */}
            <ScrollView ref={scrollRef}>
                {
                    art && ((genreQuery.length > 0 || query.length > 0) ? filteredArt : art).map(art => {
                        return (
                            <View key={art._id}>

                                <View style={styles.topConsole}>
                                    
                                    <View style={styles.topConsoleLeft} >
                                        <FindArtistAvatar style={styles.avatarImage} id={art.user} />
                                        <View style={styles.titleTextWrapper}>
                                            <Text style={styles.titleText}>{art.title}</Text>
                                            <Text style={{ color: "white" }}>by <FindArtist id={art.user} /></Text>
                                        </View>
                                    </View>
                                    
                                    <TouchableOpacity onPress={() => { setRightModal(true), setSelectedArt(art) }} hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}>
                                        <Entypo
                                            style={{ padding: 10 }}
                                            name="dots-three-horizontal"
                                            size={28} color="white"
                                        />
                                    </TouchableOpacity>
                                </View>

                                <Image key={art._id} source={{ uri: art.src }}
                                    style={{
                                        height: art.height * 0.35,
                                        width: art.height * 0.35,
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}
                                />

                                <View style={styles.bottomConsole}>

                                    <View style={styles.savedFavorite}>
                                        <FindArtistFavorite id={state.user} artId={art._id} />
                                        <Text style={{ color: "white", fontSize: 16 }}>{art.savedFavorite}</Text>
                                    </View>

                                    <Moment element={Text} fromNow style={{ color: "white" }}>
                                        {art.date}
                                    </Moment>

                                    <View style={styles.savedFavorite} >
                                        <TouchableOpacity onPress={() => { setConsoleModal(true), setSelectedArt(art), setSelectedTab("commentTab") }} hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}>
                                            <FontAwesome5 name="comments" size={22} color="white" />
                                        </TouchableOpacity>
                                        <Text style={{ color: "white", fontSize: 16 }}>{art.comments.length}</Text>
                                    </View>
                                    
                                </View>

                            </View>
                        )
                    })  
                }
                {
                    (genreQuery.length > 0 || query.length > 0) && (!filteredArt.length > 0) && 
                    <View style={{ marginRight: "auto", marginLeft: "auto", marginTop: 140 }}>
                        <Text style={{ color: "white", fontSize: 17, fontWeight: "700", flexWrap: "wrap", marginRight: "auto", marginLeft: "auto" }}>No art was found with these search terms {genreQuery}{" "}{query}</Text>
                    </View>
                }
                {
                    (!art.length && !filteredArt.length) &&
                    <ActivityIndicator size="large" color="white" style={styles.activityIndicator} />
                }
            </ScrollView>

            {/* Right Side Modal */}
            <Modal
                transparent={true}
                visible={rightModal}
            >

                <TouchableWithoutFeedback onPress={() => { setRightModal(false) }}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View style={styles.rightModalWrapper}>
                    <FlatList
                        data={[
                            {
                                id: "infoTab",
                                title: "Info"
                            },
                            {
                                id: "moreByArtistTab",
                                title: "More By Artist"
                            },
                            {
                                id: "reportTab",
                                title: "Report"
                            }
                        ]}
                        renderItem={({ item }) => 
                            <Button 
                                style={styles.ListItem} title={item.title} 
                                titleStyle={{ color:"black", fontWeight:"800" }}
                                buttonStyle={{ backgroundColor: "white", paddingTop: 22.5, paddingBottom: 22.5, borderBottomColor: "black", borderBottomWidth: 1 }} 
                                onPress = {() => {setRightModal(false), setConsoleModal(true), setSelectedTab(item.id)}}
                            />
                        }
                    />
                </View>
            </Modal>

            {/* Bottom Half Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={consoleModal}
            >
                <TouchableWithoutFeedback onPress={() => { setConsoleModal(false) }}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.consoleModalWrapper}>
                    <View><Ionicons name="ios-chevron-down" size={32} color="white" onPress={() => setConsoleModal(false)} /></View>
                    <View style={styles.tabBar}>
                        <View style={selectedTab === "infoTab" && styles.tabWrapperSelected} >
                            <AntDesign
                                name="infocirlceo"
                                size={32} color="white"
                                onPress={() => setSelectedTab("infoTab")}
                                style={selectedTab === "infoTab" && styles.tabSelected}
                            />
                        </View>
                        <View style={selectedTab === "commentTab" && styles.tabWrapperSelected}>
                            <FontAwesome5
                                name="comments"
                                size={32} color="white"
                                onPress={() => setSelectedTab("commentTab")}
                                style={selectedTab === "commentTab" && styles.tabSelected}
                            />
                        </View>

                        <View style={selectedTab === "moreByArtistTab" && styles.tabWrapperSelected}>
                            <Entypo
                                name="list" size={32} color="white"
                                onPress={() => setSelectedTab("moreByArtistTab")}
                                style={selectedTab === "moreByArtistTab" && styles.tabSelected}
                            />
                        </View>

                        <View style={selectedTab === "reportTab" && styles.tabWrapperSelected}>
                            <Octicons
                                name="report"
                                size={32}
                                color="white"
                                onPress={() => setSelectedTab("reportTab")}
                                style={selectedTab === "reportTab" && styles.tabSelected}
                            />
                        </View>
                    </View>
                    <ScrollView>
                        {selectedTab === "infoTab" && <ArtInfoTabView art={selectedArt} />}
                        {selectedTab === "commentTab" && <CommentTabView comments={selectedArt.comments} currentUserId={state.user} targetArt={selectedArt._id} reloadArt={ () => {setArt([]), setConsoleModal(false)} } />}
                        {selectedTab === "moreByArtistTab" && <MoreTabView artist={selectedArt.user} allArt={art} artId={selectedArt._id} />}
                        {selectedTab === "reportTab" && <ReportTabView artId={selectedArt._id} />}
                    </ScrollView>
                </View>
            </Modal>

            <View style={styles.footer}>
                <Entypo name="home" size={30} color="white" onPress={checkoutHome} />
                <Ionicons name="add-circle-outline" size={30} color="white" />
                <Ionicons name="person" size={30} color="white" onPress={checkoutProfile} />
            </View>

        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"black"
    },

    resultsFoundText:{
        color: "white", marginLeft: "auto", marginRight: "auto",marginTop:15, fontWeight:"700"
    },

    searchSection:{
        flexDirection:"row",
        width:"94%",
        position:"relative",
        marginLeft:"auto",
        marginRight:"auto"
    },

    searchSectionSearchBar:{
        flexDirection:"row",
        width:"76%"
    },

    searchIcon:{
        marginTop:10,
        position:"absolute",
        left:10
    },

    dropSearchIcon:{
        marginTop: 10,
        position: "absolute",
        right:10
    },

    searchInput:{
        paddingLeft:25,
        color:"white"
    },

    genreSection:{
        height:50,
        width:"94%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop:-13
    },

    genreButton:{
        backgroundColor:"white",
        borderColor:"black",
        borderRadius:8,
        borderWidth: 2,
        marginLeft:9
    },

    genreButtonSelected:{
        backgroundColor: "black",
        borderColor: "white",
        borderRadius: 8,
        borderWidth:2,
        marginLeft: 9
    },

    genreButtonTitleSelected:{
        color: "white",
        fontSize: 14,
        fontWeight: "800"
    },

    genreButtonTitleStyle:{
        color:"black",
        fontSize:14,
        fontWeight:"800"
    },  

    dropGenreSelection:{
        marginTop: -13,
        marginRight:6
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
        width:340,
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
        width: 345,
    },

    titleTextWrapper:{
        marginLeft:15
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
    },

    consoleModalWrapper:{
        backgroundColor: "black", height: "65%", marginTop: "auto", alignItems:"center"
    },

    rightModalWrapper:{
        backgroundColor: "white", height: "25%", width:"50%", marginRight:20, marginTop:400, alignItems:"center", alignSelf:"flex-end"
    },  

    tabBar:{
        flexDirection:"row",
        justifyContent:"space-around",
        width:"100%",
        marginTop:20,
    },

    tab:{
        marginBottom:20
    },

    tabSelected:{
        color:"#007FFF",
        borderBottomWidth:3,
        borderBottomColor:"white"
    },

    tabWrapperSelected:{
        paddingBottom:8,
        borderBottomWidth:2,
        borderBottomColor:"#007FFF"
    },

    ListItem:{
        width:190,
        height:68
    },

    modalOverlay:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },

    footer:{
        flexDirection:"row",
        justifyContent:"space-evenly",
        height:48,
        padding:5,
        borderTopColor:"white",
        borderTopWidth:0.17
    }

});