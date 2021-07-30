import { getActionFromState, NavigationContainer } from '@react-navigation/native';
import React, { createContext, useReducer, useContext } from 'react';
// Actions
import {
    LOGIN,
    LOGOUT,
    GET_ALL_ART,
    GET_ARTIST,
    UPDATE_ARTIST_FAVORITES,
    UPDATE_ART,
    GET_ALL_COMMENTS,
    ADD_COMMENT,
    DELETE_COMMENT,
    UPDATE_COMMENTS,
    UPDATE_ARTIST
} from "./actions"

// Global context init
const ArtContext = createContext();
const { Provider } = ArtContext;

// Reducer function
const reducer = (state, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                user: action.user
            }
        case LOGOUT:
            return {
                ...state,
                user:"",
                allArt:[],
                userInfo:{}
            }
        case GET_ALL_ART:
            return {
                ...state,
                allArt: action.allArt
            }
        case UPDATE_ART:
            return {
                ...state,
                allArt: action.allArt
            }
        case GET_ARTIST:
            return {
                ...state,
                userInfo: action.userInfo
            }
        case UPDATE_ARTIST_FAVORITES:
            return {
                ...state,
                userInfo: action.userInfo
            }
        case GET_ALL_COMMENTS:
            return {
                ...state,
                comments: action.comments
            }
        case ADD_COMMENT:
            return {
                ...state,
                comments: [action.comment ,...state.comments]
            }
        case DELETE_COMMENT:
            return {
                ...state,
                comments: action.comments
            }
        case UPDATE_COMMENTS:
            return {
                ...state,
                comments: action.comments
            }
        case UPDATE_ARTIST:
            return {
                ...state,
                userInfo: action.userInfo
            }
        default:
            return state
    }
}



// Provider init
const ArtProvider = ({ value = {}, ...props }) => {
    const [state, dispatch] = useReducer(reducer, {
        user:"",
        userInfo:{},
        allArt:[],
        comments:[]
    })

    return <Provider value={[state, dispatch]} {...props} />
}

const useArtContext = () => {
    return useContext(ArtContext);
}

export { ArtProvider, useArtContext }