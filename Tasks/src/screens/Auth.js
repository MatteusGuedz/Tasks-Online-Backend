import React, { Component } from 'react'
import { 
   ImageBackground,
   Text,
   StyleSheet,
   View,
   Alert,
   TouchableOpacity } from 'react-native'
import  AsyncStorage from '@react-native-community/async-storage'
import backGroundImage from '../assets/imgs/login.jpg'
import estiloComum from '../estiloComum'
import AuthInput from   '../components/AuthInput'
import axios from 'axios'
import { CommonActions } from '@react-navigation/native'
import {server, showError, showSucess} from '../comum'


const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  stageNew:false 
}

export default class Auth extends Component {

  state = {
  ...initialState
  }

  signinOrSignUp = () => {
    if(this.state.stageNew){
      this.signup()
    }else {
      this.signin()
    }
  }



  signup = async () => {
      try {
          await axios.post(`${server}/signup`, {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
          })

          showSucess('Usuario Cadastrado!')
          this.setState({ ...initialState})
      } catch(e){
        showError(e)
      }}


   signin = async () => {
      try {
      const res = await axios.post(`${server}/signin`, {
          email: this.state.email,
          password: this.state.password,
        })

    AsyncStorage.setItem('userData', JSON.stringify(res.data)) 
    axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
        
    // this.props.navigation.navigate('Home')
    this.props.navigation.dispatch(
      CommonActions.reset({
          index: 0,
          routes: [
              {
                  name: 'Home',
                  params: res.data,
              },
          ],
      })
  )

      } catch(e){
        showError(e)
      }   
}

 render(){
  const validations = []
    validations.push(this.state.email && this.state.email.includes('@'))
    validations.push(this.state.password && this.state.password.length >= 6)

  if(this.state.stageNew){
    validations.push(this.state.name && this.state.name.trim().length >= 3)
    validations.push(this.state.password === this.state.confirmPassword)
  }


  const validForm = validations.reduce((t, a) => t && a )



    return (
      <ImageBackground style={styles.background} source={backGroundImage}>
          <Text style={styles.title}> Tasks </Text>

          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>
              {this.state.stageNew ? 'Crie a sua conta' : 'Informe seus Dados'}
            </Text>


            {this.state.stageNew && 
              <AuthInput
                 icon='user'
                 placeholder="Nome" 
                 value={this.state.name}
                 style={styles.input}
                 onChangeText={name => this.setState({ name: name})} />
            }


            <AuthInput
                icon='at'
                placeholder="E-mail" 
                value={this.state.email}
                style={styles.input}
                onChangeText={email => this.setState({ email: email})} />

           <AuthInput
                icon='lock' 
                placeholder="Senha" 
                value={this.state.password}
                style={styles.input}
                secureTextEntry={true}
                onChangeText={password => this.setState({ password: password})} />

           {this.state.stageNew && 
            <AuthInput
              icon='lock'
              placeholder="Confirme a senha" 
              value={this.state.confirmPassword}
              style={styles.input}
              secureTextEntry={true}
              onChangeText={confirmPassword => this.setState({confirmPassword})}/>
            }     

            <TouchableOpacity 
                disabled={!validForm}
                onPress={this.signinOrSignUp}>
                <View style={
                  [styles.button, validForm 
                  ? {}
                  : {backgroundColor: '#AAA'}] }>
                  <Text style={styles.buttonText}> 
                    {this.state.stageNew ? 'Registrar' : 'Entrar'  }
                  </Text>
                </View>
            </TouchableOpacity>

        </View>

        <TouchableOpacity 
          onPress={()=> this.setState({ stageNew: !this.state.stageNew})}
          styles={{ padding:10}}>
            <Text style={styles.buttonText}>
              {this.state.stageNew 
                ? 'Já Possui conta?' 
                : 'Ainda não possui conta? '}
            </Text>
          
        </TouchableOpacity>

  </ImageBackground>
    )
  }
}



const styles = StyleSheet.create({
    background:{
        flex:1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    title:{
     // fontFamily: estiloComum,
      color: estiloComum.colors.secondary,
      fontSize:70,
      marginBottom:10
    }, 
    
    subtitle:{
      // fontFamily: estiloComum,
      color: '#fff',
      fontSize:20,
      textAlign: 'center',
      marginBottom:10,
    },

    formContainer:{
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 20,
      width: '90%'
    },

    input:{
      marginTop:10,
      backgroundColor: '#FFF',
      

    },

    button:{
      backgroundColor: '#080',
      marginTop: 10,
      padding:10,
      alignItems: 'center',
      borderRadius:7,

    },
   buttonText:{
      // fontFamily: estiloComum.fontFamily,
      color: '#FFF',
      fontSize:20
   }
})