import React, { Component } from 'react';
import {
  AlertIOS,
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import * as firebase from 'firebase'

import ActionButton from './components/ActionButton'
import ListItem from './components/ListItem'
import StatusBar from './components/StatusBar'
import styles from './styles.js'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  storageBucket: process.env.STORAGEBUCKET
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

class HokoKai extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    }

    this.itemsRef = firebaseApp.database().ref()
  }

  componentDidMount() {
    this.listenForItems(this.itemsRef)
  }

  addItem() {

    //render pop up component
    AlertIOS.prompt(
      'Add New Item',
      null,
      [
        {
          text: 'Add',
          onPress: (text) => {
            this.itemsRef.push({ title: text })
          }
        },
      ],
      'plain-text'
    )

  }

  listenForItems (itemsRef) {
    itemsRef.on('value', (snap) => {
      // get children as an array
      let items = []
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        })
      })

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      })

    })
  }

  renderItem(item) {
    const onPress = () => {
      AlertIOS.prompt(
        'Complete',
        null,
        [
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancel')}
        ],
        'default'
      )
    }

    return (
      <ListItem item={item} onPress={onPress} />
    )
  }

  render() {
    return (
      <View style={styles.container}>

        <StatusBar title="Grocery List" />

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderItem.bind(this)}
          style={styles.listview} />

          <ActionButton title="Add" onPress={this.addItem.bind(this)} />

      </View>
    )
  }
}

AppRegistry.registerComponent('HokoKai', () => HokoKai);
