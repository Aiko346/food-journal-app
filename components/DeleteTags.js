import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { CheckBox } from 'react-native-elements';

import { styles1, styles2 } from './Styles';

export default class DeleteTags extends React.Component {
  constructor(props) {
    super(props);
    const allTags = this.props.allTags;
    const allTagIds = this.props.allTagIds;
    let checkedStart = {};
    if (allTagIds != null)
      for (let i = 0; i < allTagIds.length; i++) {
        checkedStart[allTagIds[i]] = false;
      }
    let arr = [];
    allTags.map((item, i) => {
      arr.push({ tagName: item, tagId: allTagIds[i], id: i });
    });

    this.state = {
      ...checkedStart, //tag ids mapped to booleans 
      allTagsItem: arr,
    };
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress(id) {
    this.setState((state) => ({
      [id]: !state[id],
    }));
  }

  render() {
    return (
      <View style={styles1.mainContainer}>
      <View style={styles1.header}>
        <Text style={styles1.headerTxt}>Delete Tags</Text>
      </View>
        <FlatList
          data={this.state.allTagsItem}
          renderItem={({ item }) => {
            return (
              <CheckBox
                style={{ height: 20 }}
                title={item.tagName}
                checked={this.state[item.tagId]}
                onPress={() => {
                  this.handlePress(item.tagId);
                }}
              />
            );
          }}
          ItemSeparatorComponent={() => {
            return <View style={{ height: 10 }}></View>;
          }}
          initialNumToRender={10}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ alignItems: 'flex-start' }}
          style={styles2.flatList}
        />
        <View style={styles1.optionContainer}>
          <TouchableOpacity
            onPress={(e) => {
              let selectedIds = [];
              let selected = [];
              this.props.allTagIds.forEach((item, i) => {
                if (this.state[item]) {
                  selectedIds.push(item);
                  selected.push(this.props.allTags[i]);
                }
              });
              this.props.deleteTags(selected, selectedIds);
              this.props.setState({ page: 'pickTags' });
            }}>
            <Text style={styles1.bodyTxt}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              this.props.setState({
                page: 'pickTags',
              });
            }}>
            <Text style={styles1.bodyTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
