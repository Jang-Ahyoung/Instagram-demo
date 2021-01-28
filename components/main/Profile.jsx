import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import {connect} from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore')

function Profile(props) {
    const [userPost, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    useEffect(()=>{
        const { currentUser, posts } = props;
        // fetch해온 것으로부터 가져왔어!
        console.log({currentUser, posts});

        if(props.route.params.uid === firebase.auth().currentUser.uid){
            setUser(currentUser);
            setUserPosts(posts);
        }
        else{
            firebase.firestore()
                .collection("user")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    }
                    else {
                        console.log('does not exist')
                    }
                })

            firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                setUserPosts(posts);
            })

        }
    }, [props.route.params.uid])
    if(user === null){
        return <View/>
    }
    return (
        <View style={styles.container}>
            <View style={styles.InfoContainer}>
                <Text>사용자 : {user.name}</Text>
                <Text>{user.email}</Text>
            </View>

            <View style={styles.GalleryContainer}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPost}
                    renderItem={({item})=>(
                        <View style={styles.ImageContainer}>
                            <Image
                                style={styles.image}
                                source={{uri:item.downloadURL}} />
                        </View>
                    )}
                />
            </View>
            
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex : 1,
    },
    InfoContainer :{
        margin : 20,

    },
    GalleryContainer : {
        flex : 1
    },
    ImageContainer:{
        flex : 1/3, 
    },
    image : {
        flex : 1,
        aspectRatio : 1/1
    }


})
const mapStateToProps = (store) => ({
    currentUser : store.userState.currentUser,
    posts : store.userState.posts
})

export default connect(mapStateToProps, null)(Profile);
