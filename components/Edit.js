import * as React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { styles1, styles2 } from './Styles';
import CheckBox2 from './Checkbox2';

export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    const allTags = this.props.allTags;
    const allTagIds = this.props.allTagIds;
    let checkedStart = {};
    if (allTags != null)
      for (let i = 0; i < allTags.length; i++) {
        if (this.props.openTags.includes(allTags[i])) {
          checkedStart[allTagIds[i]] = true;
        } else checkedStart[allTagIds[i]] = false;
      }
    this.state = {
      name: this.props.name,
      desc: this.props.desc,
      date: this.props.date,
      image: this.props.image,
      ...checkedStart, //tag ids mapped to booleans
      newTags: [],
      newTagIds: [],
      newTag: null,
    };
    this.updateChecked = this.updateChecked.bind(this);
    this.updateNewChecked = this.updateNewChecked.bind(this);
    this.setImgState = this.setImgState.bind(this);
  }

  updateChecked(id) {
    this.setState((state) => ({
      [id]: !state[id],
    }));
  }

  updateNewChecked(id) {
    this.setState((state) => ({
      [id]: !state[id],
    }));
  }

  setImgState(uri) {
    this.setState({ image: uri });
  }

  render() {
    let options = [];
    let newOptions = [];
    const allTags = this.props.allTags;
    const allTagIds = this.props.allTagIds;
    const newTagIds = this.state.newTagIds;
    const newTags = this.state.newTags;

    if (allTags != null)
      for (let i = 0; i < allTags.length; i++) {
        options.push(
          <CheckBox2
            title={allTags[i]}
            checked={this.state[allTagIds[i]]}
            onPress={this.updateChecked}
            id={allTagIds[i]}
          />
        );
      }

    for (let i = 0; i < newTags.length; i++) {
      newOptions.push(
        <CheckBox2
          title={newTags[i]}
          checked={this.state[newTagIds[i]]}
          onPress={this.updateNewChecked}
          id={newTagIds[i]}
        />
      );
    }
    return (
      <View style={styles1.mainContainer}>
        <View style={styles1.header}>
          <Text style={styles1.headerTxt}>Edit {this.props.name}</Text>
        </View>
        <View style={styles1.contentContainer}>
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{
              marginLeft: '5%',
              width: '90%',
            }}>
            <View style={{ marginBottom: 6 }}>
              <Text style={styles1.bodyTxt}>Dish Name:</Text>
              <TextInput
                style={styles2.textInput}
                placeholder="Dish Name"
                onChangeText={(e) => {
                  this.setState({ name: e });
                }}
                multiline={true}
                value={this.state.name}
              />
            </View>
            <View style={{ marginBottom: 6 }}>
              <Text style={styles1.bodyTxt}>Description:</Text>
              <TextInput
                style={styles2.textInput}
                placeholder="Dish Description"
                onChangeText={(e) => {
                  this.setState({ desc: e });
                }}
                multiline={true}
                value={this.state.desc}
              />
            </View>
            <View style={{ marginBottom: 6 }}>
              <Text style={styles1.bodyTxt}>Date:</Text>
              <TextInput
                style={styles2.textInput}
                placeholder="Date"
                onChangeText={(e) => {
                  this.setState({ date: e });
                }}
                multiline={true}
                value={this.state.date}
              />
            </View>
            <View>
              <Text style={styles1.bodyTxt}>Dish Image:</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              {this.state.image != null && (
                <Image
                  source={{ uri: this.state.image }}
                  style={styles1.jBoxImage}
                />
              )}
              {this.state.image == null && (
                <Text
                  style={[
                    styles1.bodyTxt,
                    {
                      marginTop: 17,
                      marginBottom: 17,
                      marginLeft: 28,
                    },
                  ]}>
                  No image selected.
                </Text>
              )}
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
            <TouchableOpacity
              onPress={() => {
                this.props.pickImage(this.setImgState);
              }}
              style={[styles1.button, { marginTop: 7 }]}
              >
              <Text style={styles1.bodyTxt}>
                Pick an image from camera roll
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.takePhoto(this.setImgState);
              }}
              style={[styles1.button, { marginTop: 7 }]}
              >
              <Text style={styles1.bodyTxt}>Take a photo</Text>
            </TouchableOpacity>
            </View>
            <View style={{ width: '100%' }}>
              <View style={{ width: '100%', marginTop: 17 }}>
                <Text style={styles1.subheaderTxt}>Add Tags</Text>
              </View>
              <View style={{ width: '100%' }}>
                <Text style={styles1.bodyTxt}>New tags:</Text>
                {newOptions.length == 0 && (
                  <Text style={[styles1.bodyTxt, { marginLeft: 17 }]}>
                    No new tags.
                  </Text>
                )}
                {newOptions.length != 0 && newOptions}
              </View>
              <View style={{ width: '100%', marginLeft: 17 }}>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text style={styles1.bodyTxt}>Add Tag:</Text>
                  <TextInput
                    placeholder="Add Tag"
                    onChangeText={(e) => {
                      this.setState({ newTag: e });
                    }}
                    value={this.state.newTag}
                    style={{ marginLeft: 6, width: '50%' }}
                  />
                  <TouchableOpacity
                    onPress={async () => {
                      let newTags = [...this.state.newTags, this.state.newTag];
                      let id = await this.props.createId();
                      let newTagIds = [...this.state.newTagIds, id];
                      this.setState({
                        newTags: newTags,
                        newTag: '',
                        [id]: true,
                        newTagIds: newTagIds,
                      });
                    }}
                    style={[styles1.button, { marginLeft: 17, marginTop: 3 }]}>
                    <Text style={styles1.bodyTxt}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ width: '100%', marginTop: 17 }}>
                <Text style={styles1.bodyTxt}>Options:</Text>
                {options}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles1.optionContainer}>
          <TouchableOpacity
            onPress={(e) => {
              this.props.setState({
                openName: this.state.name,
                openImage: this.state.image,
                openDate: this.state.date,
                openDesc: this.state.desc,
              });
              this.props.editDish(
                this.props.id,
                this.state.date,
                this.state.desc,
                this.state.image,
                this.state.name
              );
              let oldTags = [];
              for (let i = 0; i < this.props.allTagIds.length; i++) {
                if (this.state[this.props.allTagIds[i]]) {
                  oldTags.push(this.props.allTags[i]);
                }
              }

              let newTags = [];
              let newTagIds = [];

              for (let i = 0; i < this.state.newTags.length; i++) {
                console.log(this.state.newTags);
                if (this.state[this.state.newTagIds[i]]) {
                  newTags.push(this.state.newTags[i]);
                  newTagIds.push(this.state.newTagIds[i]);
                }
              }
              this.props.editDishTags(
                this.props.id,
                oldTags,
                newTags,
                newTagIds
              );
              this.props.setState({
                openTags: [...oldTags, newTags],
              });
              this.props.setState({ page: 'dish' });
            }}>
            <Text style={styles1.bodyTxt}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              this.props.setState({ page: 'dish' });
            }}>
            <Text style={styles1.bodyTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
