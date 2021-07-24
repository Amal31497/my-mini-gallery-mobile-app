import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, Image, Modal, Pressable, KeyboardAvoidingView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { ScrollView } from "react-native-gesture-handler";
import { useArtContext } from '../../utils/GlobalState';
import Moment from 'react-moment';
import { loadComments } from '../../utils/API';
import { Entypo, AntDesign, FontAwesome5, Octicons, Ionicons } from '@expo/vector-icons';

const CommentTabView = (props) => {
    const [state, dispatch] = useArtContext();

    const [comments, setComments] = useState([]);

    const [postCommentModal, setPostCommentModal] = useState(false);
    const [commentPostInput, setCommentPostInput] = useState("");

    const [replyModal, setReplyModal] = useState(false);
    const [commentReply, setCommentReply] = useState();
    const [selectedCommentIdReply, setSelectedCommentIdReply] = useState("");

    useEffect(() => {
        loadComments()
            .then(response => {
                let selectedComments = [];
                response.data.forEach(comment => {
                    if(props.comments.includes(comment._id)){
                        selectedComments.push(comment)
                    }
                })
                setComments(selectedComments)
            })
            .catch(error => alert(error))
    },[props])


    return(
        <View>
            <Text style={styles.title}>Comments</Text>
            {state.user.length > 0 ?
                <Button
                    buttonStyle={styles.subtitleButton}
                    titleStyle={styles.subtitleTitle}
                    title="Post a comment"
                    onPress={() => setPostCommentModal(true)}
                />
                :
                <View style={styles.callToActionWrapper}>
                    <Button buttonStyle={{ backgroundColor: "transparent", padding: 0 }} titleStyle={styles.callToActionLink} title="Log In" />
                    <Text style={styles.callToActionText}>{" "}or{" "}</Text>
                    <Button buttonStyle={{ backgroundColor: "transparent", padding: 0 }} titleStyle={styles.callToActionLink} title="Sign Up" />
                    <Text style={styles.callToActionText}>{" "}to post a comment</Text>
                </View>
            }
            <View>
                {comments.length > 0 ?
                    comments.map(comment => {
                        return (
                            <View style={{flexDirection:"row"}} key={comment.id}>
                                <View style={styles.avatarColumn}>{comment.userInfo.avatar ? <Image source={{ uri: comment.userInfo.avatar.avatarSrc }} style={styles.avatar} /> : null}</View>
                                <Pressable style={styles.contentColumn} onPress={() => { setReplyModal(true), setSelectedCommentIdReply(comment)}}>
                                    <View style={styles.contentColumnTopRow}>
                                        {comment ? <Text style={{ color: "white", fontWeight: "700" }}>{comment.userInfo.username}</Text> : null}
                                        <Moment element={Text} fromNow style={{ color: "white" }}>
                                            {comment.date}
                                        </Moment>
                                    </View>
                                    <View style={styles.contentColumnBottomRow}>
                                        <Text style={{ color: "white", maxWidth: "95%", flexWrap:"wrap" }}>{comment.content}</Text>
                                        {comment.responses.length > 0 ?
                                            <Button titleStyle={{ fontSize: 18, fontWeight: "600" }} buttonStyle={{ backgroundColor: "#007FFF", borderRadius: 40, paddingTop: 1.5, paddintBottom: 1.5, height: 28 }} title={comment.responses.length.toString()} />
                                            :
                                            null
                                        }
                                    </View>
                                </Pressable>
                            </View>
                        )
                    })
                    :
                    <Text style={{color:"white", flexWrap:"wrap"}}>No comments for this post yet. Be the first one!</Text>
                }
            </View>

            {/* Reply to Comment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={replyModal}
            >  
                <View style={styles.replyToCommentModalWrapper}>
                    <Ionicons name="ios-chevron-down" size={32} color="white" onPress={() => {setReplyModal(false), setSelectedCommentIdReply("")}} />
                    {selectedCommentIdReply ? 
                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.avatarColumn}>{selectedCommentIdReply.userInfo.avatar ? <Image source={{ uri: selectedCommentIdReply.userInfo.avatar.avatarSrc }} style={styles.avatar} /> : null}</View>
                            <View style={styles.contentColumn}>
                                <View style={styles.contentColumnTopRow}>
                                    {selectedCommentIdReply ? <Text style={{ color: "white", fontWeight: "700" }}>{selectedCommentIdReply.userInfo.username}</Text> : null}
                                    <Moment element={Text} fromNow style={{ color: "white" }}>
                                        {selectedCommentIdReply.date}
                                    </Moment>
                                </View>
                                <View style={styles.contentColumnBottomRow}>
                                    <Text style={{ color: "white", maxWidth: "95%", flexWrap: "wrap" }}>{selectedCommentIdReply.content}</Text>
                                </View>
                            </View>
                        </View>
                        :
                        null
                    }
                    <KeyboardAvoidingView behavior="padding" style={styles.commentReplyInputBoxWrapper}>
                        <Input
                            placeholder="your response"
                            autoFocus type="text"
                            value={commentReply}
                            onChangeText={(text) => setCommentReply(text)}
                            style={styles.commentReplyInputBox}
                        />
                        <Button title="Send" />
                    </KeyboardAvoidingView>
                </View>
            </Modal>
            {/* Reply to Comment Modal Ends */}


            {/* Post Comment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={postCommentModal}
            >
                <View style={styles.replyToCommentModalWrapper}>
                    <Ionicons name="ios-chevron-down" size={32} color="white" onPress={() => { setPostCommentModal(false), setCommentPostInput("") }} />
                    <KeyboardAvoidingView behavior="padding" style={styles.commentReplyInputBoxWrapper}>
                        <Input
                            placeholder="your comment"
                            autoFocus type="text"
                            value={commentPostInput}
                            onChangeText={(text) => setCommentPostInput(text)}
                            style={styles.commentReplyInputBox}
                        />
                        <Button title="Send" />
                    </KeyboardAvoidingView>
                </View>
            </Modal>
            {/* Post Comment Modal End */}

        </View>
    )
}

export default CommentTabView;

const styles = StyleSheet.create({
    title:{
        flex:1,
        color:"white",
        fontSize:20,
        marginTop: 45,
        marginBottom:10,
        fontWeight:"800",
        marginLeft:"auto",
        marginRight:"auto"
    },

    subtitleButton:{
        marginBottom:30,
        color:"white",
        backgroundColor:"transparent",
        marginLeft: "auto",
        marginRight: "auto"
    },

    subtitleTitle:{
        fontSize:15
    },

    callToActionText:{
        color:"white"
    },

    callToActionLink:{
        color:"#007FFF",
        fontWeight:"700",
        fontSize:13
    },  

    callToActionWrapper:{
        flex:1,
        flexDirection:"row",
        alignSelf:"center",
        marginBottom:30
    },

    avatarColumn:{
        width:50
    },

    avatar:{
        height:30,
        width:30
    },  

    contentColumn:{
        flexDirection:"column",
        width:280
    },

    contentColumnTopRow:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:10
    },

    contentColumnBottomRow:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },

    replyToCommentModalWrapper: {
        backgroundColor: "black", height: "65%", marginTop: "auto", alignItems: "center"
    },

    commentReplyInputBoxWrapper:{
        width:"90%"
    },

    commentReplyInputBox:{
        color:"white",
        flexWrap:"wrap",
        height:60
    }
})