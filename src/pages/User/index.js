import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Div,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    this.setState({loading: true});
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        per_page: 5,
        page: 1,
      },
    });
    this.setState({stars: response.data, loading: false});
  }

  loadMore = async () => {
    const {stars, page} = this.state;
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        per_page: 5,
        page: page + 1,
      },
    });
    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
    });
  };

  refreshList = async () => {
    this.setState({loading: true, refreshing: true});
    const {navigation} = this.props;
    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        per_page: 5,
        page: 1,
      },
    });
    this.setState({
      stars: response.data,
      loading: false,
      refreshing: false,
      page: 1,
    });
  };

  handleNavigate = item => {
    console.tron.log(item);
    const {navigation} = this.props;

    navigation.navigate('Repository', {item});
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading, refreshing} = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? <ActivityIndicator size="large" color="#aaa" /> : <Div />}
        <Stars
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          onRefresh={this.refreshList}
          refreshing={refreshing}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({item}) => (
            <Starred
              onPress={() => this.handleNavigate(item)}
              underlayColor="white">
              <Div>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Div>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
