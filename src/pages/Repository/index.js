import React, {Component} from 'react';
import WebView from 'react-native-webview';
import PropTypes from 'prop-types';

import {Container} from './styles';

export default class Repository extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('item').full_name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const {navigation} = this.props;
    const repository = navigation.getParam('item');
    console.tron.log(repository);
    return (
      <Container>
        <WebView source={{uri: repository.html_url}} style={{flex: 1}} />
      </Container>
    );
  }
}
