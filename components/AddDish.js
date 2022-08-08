import * as React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { styles1, styles2 } from './Styles';
import CheckBox2 from './Checkbox2';

export default class AddDish extends React.Component {
  constructor(props) {
    super(props);
    let checkedStart = [];
    if (
      (this.props.checked == null || this.props.checked.length == 0) &&
      this.props.allTags != null
    ) {
      for (let i = 0; i < this.props.allTags.length; i++) {
        checkedStart.push(false);
      }
      this.props.setState({ checked: checkedStart });
    }
    this.state = {};
    this.updateChecked = this.updateChecked.bind(this);
    this.updateNewChecked = this.updateNewChecked.bind(this);
    this.setImgState = this.setImgState.bind(this);
  }

  updateChecked(id) {
    this.props.setState((state) => {
      let checked = state.checked;
      checked[id] = !checked[id];
      return { checked: checked };
    });
  }

  updateNewChecked(id) {
    this.props.setState((state) => {
      let newChecked = state.newChecked;
      newChecked[id] = !newChecked[id];
      return { newChecked: newChecked };
    });
  }

  setImgState(uri) {
    this.props.setState({ dishImage: uri });
  }

  render() {
    let options = [];
    let newOptions = [];
    if (this.props.allTags != null)
      for (let i = 0; i < this.props.allTags.length; i++) {
        options.push(
          <CheckBox2
            title={this.props.allTags[i]}
            checked={this.props.checked[i]}
            onPress={this.updateChecked}
            id={i}
          />
        );
      }

    for (let i = 0; i < this.props.newTags.length; i++) {
      newOptions.push(
        <CheckBox2
          title={this.props.newTags[i]}
          checked={this.props.newChecked[i]}
          onPress={this.updateNewChecked}
          id={i}
        />
      );
    }

    return (
      <View style={styles1.mainContainer}>
        <TouchableOpacity
          style={styles1.header}
          onPress={(e) => {
            this.props.setState({ page: 'home' });
          }}>
          <View style={styles2.header}>
            <Text style={styles1.headerTxt}>Add Dish</Text>
            <Icon
              style={{ marginLeft: 6 }}
              name="caret-down"
              type="font-awesome"
            />
          </View>
        </TouchableOpacity>

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
                  this.props.setState({ dishName: e });
                }}
                multiline={true}
                value={this.props.dishName}
              />
            </View>

            <View style={{ marginBottom: 6 }}>
              <Text style={styles1.bodyTxt}>Description:</Text>
              <TextInput
                style={styles2.textInput}
                placeholder="Dish Description"
                onChangeText={(e) => {
                  this.props.setState({ dishDesc: e });
                }}
                multiline={true}
                value={this.props.dishDesc}
              />
            </View>

            <View style={{ marginBottom: 6 }}>
              <Text style={styles1.bodyTxt}>Date:</Text>
              <TextInput
                style={styles2.textInput}
                placeholder="Date"
                onChangeText={(e) => {
                  this.props.setState({ dishDate: e });
                }}
                multiline={true}
                value={this.props.dishDate}
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
              {this.props.dishImage != null && (
                <Image
                  source={{ uri: this.props.dishImage }}
                  style={styles1.jBoxImage}
                />
              )}
              {this.props.dishImage == null && (
                <Text style={styles1.bodyTxt}>No image selected.</Text>
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
                style={[styles1.button, { marginTop: 7 }]}>
                <Text style={styles1.bodyTxt}>
                  Pick an image from camera roll
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.takePhoto(this.setImgState);
                }}
                style={[styles1.button, { marginTop: 7 }]}>
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
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={styles1.bodyTxt}>Add Tag:</Text>
                  <TextInput
                    placeholder="Add Tag"
                    onChangeText={(e) => {
                      this.props.setState({ newTag: e });
                    }}
                    value={this.props.newTag}
                    style={{ marginLeft: 6, width: '50%' }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      let newTags = [...this.props.newTags, this.props.newTag];
                      let newChecked = [...this.props.newChecked, true];
                      this.props.setState({
                        newTags: newTags,
                        newTag: '',
                        newChecked: newChecked,
                      });
                    }}
                    style={[styles1.button, { marginLeft: 17, marginTop: 3 }]}>
                    <Text style={styles1.bodyTxt}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ width: '100%', marginTop: 17 }}>
                <View style={{ width: '100%' }}>
                  <Text style={styles1.bodyTxt}>Options:</Text>
                  {options}
                </View>
              </View>
              <View style={{ height: 100 }}></View>
            </View>
          </ScrollView>
        </View>

        <View style={styles1.optionContainer}>
          <TouchableOpacity
            onPress={(e) => {
              let selected = [];
              for (let i = 0; i < this.props.allTags.length; i++) {
                if (this.props.checked[i]) {
                  selected.push(this.props.allTags[i]);
                }
              }
              let newSelected = [];
              for (let i = 0; i < this.props.newTags.length; i++) {
                if (this.props.newChecked[i]) {
                  newSelected.push(this.props.newTags[i]);
                }
              }
              this.props.setState({
                dishTag: selected,
                newTags: newSelected, //used to be newdishtag
                checked: [],
                newChecked: [],
              });
              this.props.addDish();
              this.props.setState({ page: 'home' });
            }}>
            <Text style={styles1.bodyTxt}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              this.props.setState({
                page: 'home',
                addDishActive: false,
                dishDesc: null,
                dishName: null,
                dishImage: null,
                dishDate: null,
                newTags: [],
                checked: [],
                newTag: '',
                newChecked: [],
              });
            }}>
            <Text style={styles1.bodyTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
