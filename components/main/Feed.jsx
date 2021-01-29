import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList,Button } from 'react-native';
import {connect} from 'react-redux';
import firebase from 'firebase';
require('firebase/firestore')

function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        let posts = [];
        if(props.usersLoaded == props.following.length){
            for(let i=0; i<props.following.length; i++){
                const user = props.users.find(el => el.uid === props.following[i]);
                if(user != undefined){
                    posts = [...posts, ...user.posts]; 
                }
            }
            posts.sort(function(x,y) {
                return x.creation -y.creation;
            })

            setPosts(posts);
        }
    }, [props.usersLoaded])


    return (
        <View style={styles.container}>
            <View style={styles.GalleryContainer}>
                <Text>왜안떠왜왜왜</Text>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item})=>(
                        <View style={styles.ImageContainer}>
                            <Text style={styles.container}>{item.user.name}</Text>
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
    following : store.userState.following,
    users : store.userState.users,
    usersLoaded : store.userState.usersLoaded,
})

export default connect(mapStateToProps, null)(Feed);
