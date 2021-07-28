import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, Image, Modal, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useArtContext } from '../../utils/GlobalState';
import Moment from 'react-moment';
import { loadComments, addComment, updateArt, getArtist, deleteComment } from '../../utils/API';
import { ADD_COMMENT, GET_ALL_COMMENTS, UPDATE_ART, DELETE_COMMENT } from "../../utils/actions";
import { Entypo, AntDesign, FontAwesome5, Octicons, Ionicons } from '@expo/vector-icons';

const CommentTabView = (props) => {
    const [state, dispatch] = useArtContext();
    const [currentUser, setCurrentUser] = useState();
    const [comments, setComments] = useState([]);

    const [commentPostInput, setCommentPostInput] = useState("");
    const [postCommentModal, setPostCommentModal] = useState(false);
    const [replyModal, setReplyModal] = useState(false);
    const [areYouSureModal, setAreYourSureModal] = useState(false);
    const [selectedCommentIdForDeletion, setSelectedCommentIdForDeletion] = useState("");
    const [commentReply, setCommentReply] = useState();
    const [selectedCommentIdReply, setSelectedCommentIdReply] = useState("");


    const showComments = () => {
        let filteredComments = [];
        props.allComments.forEach(comment => {
            if (comment.art === props.targetArt){
                filteredComments.push(comment)
            }
        })
        setComments(filteredComments);
    }

    const findCurrentArtist = () => {
        setCurrentUser({
            username: state.userInfo.username,
            avatar: state.userInfo.avatar,
            description: state.userInfo.description,
            firstName: state.userInfo.firstName
        })
    }

    const handleCommentSubmit = (event) => {
        event.preventDefault();

        // Comment
        let comment = {
            content: commentPostInput,
            // Nesting descriptive artist info in comment schema
            userInfo: currentUser,
            date: Date.now(),
            user: state.user.user_id,
            art: props.targetArt
        }

        if (comment.art && comment.user) {
            addComment(comment)
                .then(response => {
                    setComments([response.data, ...comments]);
                    setPostCommentModal(false);
                    dispatch({
                        type:ADD_COMMENT,
                        comment:response.data
                    })
                    updateArt(props.targetArt, { _id: response.data._id })
                        .then(response => {
                        })
                        .catch(error => alert(error));
                })
                .catch(error => alert(error))
            setCommentPostInput("");
        }
    }

    const deleteSelectedComment = (event, id) => {
        event.preventDefault();

        deleteComment(id)
            .then(response => {
                let updatedComments = [];
                comments.forEach(comment => {
                    if(comment._id !== response.data._id){
                        updatedComments.push(comment)
                    }
                })
                setComments(updatedComments)
                dispatch({
                    type:DELETE_COMMENT,
                    comments:updatedComments
                })

            })
            .catch(error => alert(error))
    }
    

    useEffect(() => {
        showComments();
        findCurrentArtist();
    },[])


    return(
        <View>
            <Text style={styles.title}>Comments</Text>
            {state.user.user_id.length > 0 ?
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
                            <View style={{flexDirection:"row"}} key={comment._id}>
                                <View style={styles.avatarColumn}>{comment.userInfo.avatar ? <Image source={{ uri: comment.userInfo.avatar.avatarSrc }} style={styles.avatar} /> : null}</View>
                                <View style={styles.contentColumn} >
                                    <View style={styles.contentColumnTopRow}>
                                        {comment ? <Text style={{ color: "white", fontWeight: "700" }}>{comment.userInfo.username}</Text> : null}
                                        <View style={{flexDirection:"row"}}>
                                            <Moment element={Text} fromNow style={{ color: "white" }}>
                                                {comment.date}
                                            </Moment>
                                            <Button 
                                                title="del" 
                                                buttonStyle={{ marginLeft: 5, backgroundColor: "transparent", padding:0, height:20, width:20, marginTop:-4 }} 
                                                titleStyle={{ color: "red", alignSelf:"center", fontSize:15 }} 
                                                onPress={() => {setSelectedCommentIdForDeletion(comment._id), setAreYourSureModal(true)}} 
                                            />
                                        </View>
                                    </View>
                                    <Pressable style={styles.contentColumnBottomRow} onPress={() => { setReplyModal(true), setSelectedCommentIdReply(comment) }}>
                                        <Text style={{ color: "white", maxWidth: "95%", flexWrap:"wrap" }}>{comment.content}</Text>
                                        {comment.responses.length > 0 ?
                                            <Button titleStyle={{ fontSize: 18, fontWeight: "600" }} buttonStyle={{ backgroundColor: "#007FFF", borderRadius: 40, paddingTop: 1.5, paddintBottom: 1.5, height: 28 }} title={comment.responses.length.toString()} />
                                            :
                                            null
                                        }
                                    </Pressable>
                                </View>
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
                        <Button title="Send" onPress={handleCommentSubmit} />
                    </KeyboardAvoidingView>
                </View>
            </Modal>
            {/* Post Comment Modal End */}

            {/* Are you sure Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={areYouSureModal}
            >
                <TouchableWithoutFeedback onPress={() => { setSelectedCommentIdReply(""), setAreYourSureModal(false)}}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View style={styles.areYourSureModalWrapper}>
                    <Text style={{color:"white", marginTop:20, fontSize:16, fontWeight:"700"}}>Are you sure?</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-between", width:"50%", marginTop:20}}>
                        <Button title="No!" onPress={() => { setSelectedCommentIdReply(""), setAreYourSureModal(false)}} titleStyle={{ fontWeight: "700" }} />
                        <Button title="Yes, Delete" onPress={(event) => { deleteSelectedComment(event, selectedCommentIdForDeletion), setAreYourSureModal(false)}} buttonStyle={{ backgroundColor:"#ff6961"}} titleStyle={{ fontWeight:"700" }} />
                    </View>
                </View>
            </Modal>
            {/* Are you sure Modal end */}

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
    },

    areYourSureModalWrapper:{
        backgroundColor:"black", height:"25%", marginTop:"auto", alignItems:"center", borderTopColor:"white", borderTopWidth:1
    },

    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
})