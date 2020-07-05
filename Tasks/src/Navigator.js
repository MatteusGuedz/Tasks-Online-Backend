import React from 'react'
import {Text} from 'react-native'
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Auth from './screens/Auth'
import AuthOrApp from './screens/AuthOrApp'
import TaskList from './screens/Agenda'
import Menu from './screens/Menu' 

import estiloComum from './estiloComum'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const menuConfig = {
    labelStyle: {
        // fontFamily: commonStyles.fontFamily,
        fontWeight: 'normal',
        fontSize: 20
    },
    activeTintColor: '#080',

}



const DrawerNavigator = props => {
   const { email, name } = props.route.params

    
    
    return (
        <Drawer.Navigator drawerContentOptions={menuConfig}
    drawerContent={(props) => <Menu {...props} 
    email={email} 
    name={name} 
    /> }>
            <Drawer.Screen name="Today" options={{ title: 'Hoje' }}>
                {props => <TaskList 
                
                {...props}
                 title='Hoje' 
                 daysAhead={0} />}
            </Drawer.Screen>
            <Drawer.Screen name="Tomorrow" options={{ title: 'Amanhã' }}>
                {props => <TaskList 
                 {...props}
                 title='Amanhã' 
                 daysAhead={1} />}
            </Drawer.Screen> 
            <Drawer.Screen name="Week" options={{ title: 'Semana' }}>
                {props => <TaskList 
                 {...props}
                 title='Semana' 
                 daysAhead={7} />}
            </Drawer.Screen>
            
            <Drawer.Screen name="Month" options={{ title: 'Mês' }}>
                {props => <TaskList 
                 {...props}
                 title='Mês' 
                 daysAhead={30} />}
            </Drawer.Screen>

           
        </Drawer.Navigator>
    );
};


const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthOrApp" component={AuthOrApp} /> 
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="Home" component={DrawerNavigator} />
        </Stack.Navigator>
    );
};

const Navigator = () => {
    return (
        <NavigationContainer>
            <AuthNavigator />
        </NavigationContainer>
    );
};



export default Navigator;



