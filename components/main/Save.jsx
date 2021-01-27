import React,{useState} from 'react'
import { View, TextInput, Image, Button } from 'react-native';
import firebase from 'firebase';
import { NavigationContainer } from '@react-navigation/native';
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save({route,navigation}) {
    const userIamge= route.params.image;
    const childPath = `/post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`

    const [caption, setCaption] = useState("");
    const uploadImage = async()=>{
        const uri = userIamge;
        const reponse = await fetch(uri);
        const blob = await reponse.blob();
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot =>{
            console.log(`transferred:${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot);
            })
        }
        const taskError = snapshot =>{
            console.log(snapshot)
        }
        task.on("state_changed",taskProgress, taskError, taskCompleted)
    }
    const savePostData = (downloadURL)=>{
        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                creation : firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                navigation.popToTop()
            }))
    }

    return (
        <View style={{flex:1}}>
            <Image source={{uri:userIamge}}/>
            <TextInput
                placeholder="✍ 게시물을 작성하세요 . ."
                onChangeText={(caption)=>setCaption(caption)}
            />
            <Button title="Save" onPress={()=> uploadImage()}/>
        </View>
    )
}
