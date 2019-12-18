import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ActivityIndicator } from 'react-native';
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
  RepositoryButton,
} from './styles';

class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });
  static propTypes = {
    navigation: PropTypes.shape({
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
    this.load();
  }
  load = async (page = 1) => {
    const { stars } = this.state;
    const { navigation } = this.props;
    this.setState({
      loading: true,
      refreshing: true,
    });

    const user = navigation.getParam('user');
    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
      },
    });

    this.setState({
      stars: page > 1 ? [...stars, ...response.data] : response.data,
      loading: false,
      refreshing: false,
      page,
    });
  };

  loadMore = async () => {
    const { page } = this.state;
    this.load(page + 1);
  };
  refreshList = () => {
    this.load();
  };
  handleNavigate = item => {
    const { navigation } = this.props;
    const { name, html_url } = item;
    navigation.navigate('Favorite', { name, html_url });
  };
  render() {
    const { stars, loading } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading && !stars ? (
          <ActivityIndicator color="#7159c1" />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <RepositoryButton onPress={() => this.handleNavigate(item)}>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </RepositoryButton>
                </Info>
              </Starred>
            )}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={this.state.refreshing}
          />
        )}
      </Container>
    );
  }
}

export default User;
