import {Alert, Platform} from 'react-native'

const server = Platform.OS === 'ios'
  ? 'http://locahost:3000'
  : 'http://192.168.1.12:3000'



  function showError(err) {
    if(err.response && err.response.data){
      Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err.response.data}`)
    }else{
      Alert.alert('Ops! Ocorreu um Problema!', `Mensagem: ${err}`)
    }
  }

  function showSucess(msg) {
    Alert.alert('Sucesso!', msg)
  }



  export { server, showError, showSucess}