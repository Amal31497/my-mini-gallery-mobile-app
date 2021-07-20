import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View, Image, Modal, Button } from 'react-native';
import Moment from 'react-moment';
import { loadComments } from '../../utils/API';

const CommentTabView = (props) => {
    const [comments, setComments] = useState([]);

    // useEffect(() => {
    //     loadComments()
    //         .then(response => {
    //             // props.comments.map(comment => {
    //             //     if(comment._id in response.data){
    //             //         setComments([...comments,response.data])
    //             //     }
    //             // })
    //             console.log(response.data)
    //         })
    // },[props])


    return(
        <View>
            <Text style={styles.title}>Comments</Text>
            <View>

            </View>
        </View>
    )
}

export default CommentTabView;

const styles = StyleSheet.create({
    title:{
        color:"white",
        fontSize:20,
        marginTop: 45,
        fontWeight:"800"
    }
})