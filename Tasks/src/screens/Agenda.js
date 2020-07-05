import React, { Component, useEffect } from 'react'
import moment from 'moment'
import 'moment/locale/pt-br'
import hojeImage from '../assets/imgs/today.jpg'
import tomorrowImage from '../assets/imgs/tomorrow.jpg'
import weekImage from '../assets/imgs/week.jpg'
import monthImage from '../assets/imgs/month.jpg'

import estiloComum from '../estiloComum'
import Task from '../components/Task'
import AddTask from './AddTask'
import Icon from '@expo/vector-icons/FontAwesome'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import {server, showError} from  '../comum'

import { 
	StyleSheet,
	Text,
	View,
	ImageBackground,
	FlatList,
	TouchableOpacity,
	Platform,
	Alert
} from 'react-native'


const initialState = {
	tasks: [],
	visibleTasks:[],
	showDoneTasks:true,
	showAddTask:false
}

export default class Agenda extends Component {


	state = {
		...initialState
	}

	addTask =  async newTask => {
			if(!newTask.desc || !newTask.desc.trim()){
				Alert.alert('Dados Inválidos', 'Descrição não informada!')
				return
			}

			try{
				await axios.post(`${server}/tasks`,{
					desc: newTask.desc,
					estimateAt:  newTask.date
				})

				this.setState({newTask , showAddTask: false}, this.loadTasks)

				this.setState({ })
			}catch(e){
				showError(e)
			}
	
		
	
	}

	toggleTask = async taskId  => {
		
		try{
			await axios.put(`${server}/tasks/${taskId}/toggle`) 
			 this.loadTasks()
		}catch(e){
			showError(e)
		}
	}

	//ou

	// toggleTask = id  => {
	// 	const tasks = this.state.tasks.map(task => {
	// 		if (task.id === id){
	// 			task = {...task}
	// 			task.doneAt = task.doneAt ? null : new Date()
	// 		}
	// 		return task
	// 	})
	// 	this.setState({tasks})
	// }
	 
	filterTask = () => {
		let visibleTasks = null
	
		if(this.state.showDoneTasks){
		visibleTasks = [...this.state.tasks]
	} else {
		const pending = task => task.doneAt === null
		visibleTasks = this.state.tasks.filter(pending)
	}

	this.setState({ visibleTasks })
	AsyncStorage.setItem('tasksState', JSON.stringify({
			showDoneTasks: this.state.showDoneTasks
	}))
	}

	toggleFilter = () => {
		this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTask)
	}

  componentDidMount = async() => {
		const stateString = await AsyncStorage.getItem('tasksState')
		const savedState = 	JSON.parse(stateString) ||  initialState
		this.setState({
				showDoneTasks: savedState.showDoneTasks
		}, this.filterTask)

		this.loadTasks()
	}


	loadTasks = async () => {
		try{
				const DataMax = moment()
					.add({days: this.props.daysAhead})
					.format('YYYY-MM-DD  23:59:59')

				const res = await axios.get(`${server}/tasks?date=${DataMax}`)
				this.setState({ tasks: res.data}, this.filterTask)
 		}catch(e){
			showError(e)
		}
	}


	deleteTask = async taskId => {
		try{
				await axios.delete(`${server}/tasks/${taskId}`)
			  this.loadTasks()
		} catch(e){
				showError(e)
		}
	}


	getImage = () => {
		switch(this.props.daysAhead){
			case 0: return  hojeImage
			case 1: return  tomorrowImage
			case 7: return  weekImage
			default: return  monthImage
		}
	} 

	getColor = () => {
		switch(this.props.daysAhead){
			case 0: return  estiloComum.colors.today
			case 1: return  estiloComum.colors.tomorrow
			case 7: return  estiloComum.colors.week
			default: return estiloComum.colors.month
		}
	}

	render(){



		return (

			<View style={styles.container}> 
			<AddTask  
			  isVisible={this.state.showAddTask}
				onSave={this.addTask}
				onCancel={() => this.setState({ showAddTask:false})}			
				/>

			<ImageBackground  source={this.getImage()} style={styles.background}>
				
				<View style={styles.iconBar}>
				<TouchableOpacity onPress={ () => this.props.navigation.openDrawer()}>
						<Icon 
							size={20} color={estiloComum.colors.secondary}
							name='bars' 
									/>
					</TouchableOpacity>

					<TouchableOpacity onPress={this.toggleFilter}>
						<Icon 
							size={20} color={estiloComum.colors.secondary}
							name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} 
									/>
					</TouchableOpacity>
				</View>

				<View style={styles.titleBar}>
					<Text style={styles.title}>{this.props.title}</Text>
					<Text style={styles.subtitle}>
					 {moment().locale('pt-br').format('ddd, D [de] MMMM')}
					</Text>
					
			    </View>
			 </ImageBackground>



			    <View style={styles.tasksContainer}>
					 
					 <FlatList
					  keyExtractor={item => `${item.id}`} 
					 	data={this.state.visibleTasks} 
						 renderItem={({item}) => 
						 <Task {...item} 
						 onDelete={this.deleteTask}
						 onToggleTask={this.toggleTask}/>}>

						 </FlatList>
			    </View>

		

				<TouchableOpacity  
					activeOpacity={0.7}			
					onPress={() => { this.setState({ showAddTask: true })}}
					style={[styles.addButton, {backgroundColor: this.getColor()} ]} >
					<Icon 
						name="plus" 
						size={20} 
						color={estiloComum.colors.secondary}/>
					
				</TouchableOpacity>

			</View>
	)
  }
}

const styles = StyleSheet.create({
	container:{
			flex:1,
	},

	background:{
		flex:3,
	},

	titleBar:{
		flex:1,
		justifyContent: 'flex-end'
	},

	title:{
		// fontFamily: estiloComum.fontFamily,
		color: estiloComum.colors.secondary,
		fontSize:50,
		marginLeft: 20,
		marginBottom:10,
	},

	subtitle:{
		// fontFamily:
		color: estiloComum.colors.secondary,
		fontSize:20,
		marginLeft: 20,
		marginBottom:30,
	},
	tasksContainer:{
		 flex:7,
	},
	iconBar:{
		marginTop: Platform.OS === 'ios' ? 30 : 10,
		marginHorizontal:20,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},

	addButton:{
		position: 'absolute',
		right: 30,
		bottom:30,
		width:50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center'

	}



});
