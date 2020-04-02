import React, { Component } from 'react';
import api from '../services/api';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class New extends Component {
  state = {
    author: '',
    place: '',
    description: '',
    hashtags: '',
    preview: null,
    image: null
  };

  getPermissionAsync = async () => {
    if (Constants.platform.android || Constants.platform.ios) {
      const { status: camera_status } = await Permissions.askAsync(
        Permissions.CAMERA
      );
      const { status: write_status } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      if (camera_status !== 'granted' || write_status !== 'granted') {
        alert(
          'Sorry, we need camera and writing permissions to perform this operation!'
        );
      }
    }
  };

  handleSelectImage = async () => {
    await this.getPermissionAsync();

    const {
      cancelled,
      base64,
      uri,
      type
    } = await ImagePicker.launchImageLibraryAsync({
      base64: true
    });

    if (cancelled) {
      console.log('User canceled');
    } else {
      const preview = {
        uri: `data:image/jpeg;base64,${base64}`
      };

      const time = new Date().getTime();

      const image = {
        uri: uri,
        type: type,
        name: 'IMG_' + time + '.jpg'
      };

      this.setState({ preview, image });
    }
  };

  handleSubmit = async () => {
    const data = new FormData();

    data.append('image', this.state.image);
    data.append('author', this.state.author);
    data.append('place', this.state.place);
    data.append('description', this.state.description);
    data.append('hashtags', this.state.hashtags);

    try {
      await api.post('/posts', data);
    } catch (err) {
      console.log(err);
    }

    console.log('out');
    this.props.navigation.navigate('Feed');
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.handleSelectImage}
          style={styles.selectButton}
        >
          <Text style={styles.selectButtonText}>Selecionar Imagem</Text>
        </TouchableOpacity>

        {this.state.preview && (
          <Image style={styles.preview} source={this.state.preview} />
        )}

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Nome do autor"
          placeholderTextColor="#999"
          value={this.state.author}
          onChangeText={author => this.setState({ author })}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Local da foto"
          placeholderTextColor="#999"
          value={this.state.place}
          onChangeText={place => this.setState({ place })}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Descrição"
          placeholderTextColor="#999"
          value={this.state.description}
          onChangeText={description => this.setState({ description })}
        />

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Hashtags"
          placeholderTextColor="#999"
          value={this.state.hashtags}
          onChangeText={hashtags => this.setState({ hashtags })}
        />

        <TouchableOpacity
          onPress={this.handleSubmit}
          style={styles.shareButton}
        >
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center'
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666'
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center'
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF'
  }
});
