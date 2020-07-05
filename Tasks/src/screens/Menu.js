import React from 'react'
import { Platform,  View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { CommonActions } from '@react-navigation/native';
import  Gravatar  from '@krosben/react-native-gravatar'
import commonStyles from '../estiloComum'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from '@expo/vector-icons/FontAwesome'

export default props => {

    const logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'Auth',
                    },
                ],
            })
        )
    }

    return (
        <DrawerContentScrollView>
             <View style={styles.header}>
                
                
                
                 <View style={styles.userInfo}>
                 <Gravatar style={styles.avatar}
                    options={{
                        email: props.email,
                        secure: true
                    }} />
                    <Text style={styles.name}>
                        {props.name}
                    </Text>
                    <Text style={styles.email}>
                        {props.email}
                    </Text>
                </View>
                
            </View> 
            
            <DrawerItemList {...props} />
            
            <View style={styles.SubBox}>
                 <Text style={styles.title}>SAIR</Text>
                 <TouchableOpacity onPress={logout}>
                    <View style={styles.logoutIcon}>
                        <Icon name='sign-out' size={30} color='#800' />
                    </View>
                </TouchableOpacity>
                 </View>
             
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#DDD',

        paddingTop: Platform.OS === 'ios' ? 70 : 30,
        
       
    },
    SubBox:{
        
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
        paddingTop: Platform.OS === 'ios' ? 70 : 30,
    },
    title: {
        color: '#000',
        // fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        padding: 10
    },
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
       
        margin: 10,
        backgroundColor: '#222'
    },
    userInfo: {
        marginLeft: 10,
        alignItems:'center'
    },
    name: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: commonStyles.colors.mainText,
        marginBottom: 5,
    },
    email: {
        // fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: commonStyles.colors.subText,
        marginBottom: 10,
    },
    logoutIcon: {
        marginLeft: 10,      
    }
})