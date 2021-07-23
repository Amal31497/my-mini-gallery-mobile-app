
import axios from 'axios';

// User authentication
const signup = (user) => axios.post('https://my-mini-gallery.herokuapp.com/api/user/',user);
const login = (user) => axios.post('https://my-mini-gallery.herokuapp.com/api/user/login/', user);
const logout = () => axios.post('https://my-mini-gallery.herokuapp.com/api/user/logout/');
const authenticatedUser = () => axios.get("https://my-mini-gallery.herokuapp.com/api/user/authenticatedUser/");

// Art routes
const createArt = (art) => axios.post("https://my-mini-gallery.herokuapp.com/api/art/", art);
const getAllArt = () => axios.get("https://my-mini-gallery.herokuapp.com/api/art/");
const getOneArt = (id) => axios.get("https://my-mini-gallery.herokuapp.com/api/art/" + id);
const updateArt = (id, comment) => axios.put("https://my-mini-gallery.herokuapp.com/api/art/" + id, comment);
const dropArtistArt = (user) => axios.delete("https://my-mini-gallery.herokuapp.com/api/art/emptyUserArt/" + user);
const deleteArt = (id) => axios.delete("https://my-mini-gallery.herokuapp.com/api/art/" + id);

// Artist/User routes
const getArtist = (id) => axios.get("https://my-mini-gallery.herokuapp.com/api/user/" + id);
const updateUser = (id, user) => axios.put("https://my-mini-gallery.herokuapp.com/api/user/" + id, user);
const addNewArtToUser = (id, artId) => axios.put("https://my-mini-gallery.herokuapp.com/api/user/" + id, artId);
const addNewFavoriteArt = (id, artId) => axios.put("https://my-mini-gallery.herokuapp.com/api/user/" + id, artId);
const deleteArtist = (id) => axios.delete("https://my-mini-gallery.herokuapp.com/api/user/" + id);


// Comment routes
const addComment = (comment) => axios.post("https://my-mini-gallery.herokuapp.com/api/comment/", comment);
const loadComments = () => axios.get("https://my-mini-gallery.herokuapp.com/api/comment/");
const updateComment = (id, response) => axios.put("https://my-mini-gallery.herokuapp.com/api/comment/" + id, response);
const dropUserComments = (user) => axios.delete("https://my-mini-gallery.herokuapp.com/api/comment/emptyUserComments/" + user);
const dropArtComments = (art) => axios.delete("https://my-mini-gallery.herokuapp.com/api/comment/emptyArtComments/" + art)
const deleteComment = (id) => axios.delete("https://my-mini-gallery.herokuapp.com/api/comment/" + id);

// Search routes
const queryArt = (query) => axios.get("https://my-mini-gallery.herokuapp.com/api/query/" + query);

export {
    // User authentication
    signup,
    login,
    logout,
    authenticatedUser,

    // Art routes
    createArt,
    getAllArt,
    getOneArt,
    updateArt,
    dropArtComments,
    deleteArt,
    dropArtistArt,

    // Artist/User routes
    getArtist,
    updateUser,
    deleteArtist,
    addNewArtToUser,
    addNewFavoriteArt,

    // Comment routes
    addComment,
    loadComments,
    updateComment,
    dropUserComments,
    deleteComment,

    // Search routes
    queryArt
}