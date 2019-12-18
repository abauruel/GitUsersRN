import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';

// import { Container } from './styles';

export default class Favorite extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('name'),
  });
  render() {
    const repository_url = this.props.navigation.getParam('html_url');
    return <WebView source={{ uri: repository_url }} style={{ flex: 1 }} />;
  }
}
