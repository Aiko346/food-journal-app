import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Icon, CheckBox } from 'react-native-elements';

import { styles1, styles2  } from './Styles';

export default class PickTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked,
      noneSelected: this.props.noneSelected,
    };

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress(id) {
    let copy = [...this.state.checked];
    copy[id] = !copy[id];
    this.setState({ checked: copy });
  }
  render() {
    const allTagsItem = this.props.allTagsItem;

    return (
      <View style={styles1.mainContainer}>
        <TouchableOpacity
          style={styles1.header}
          onPress={(e) => {
            let selected = [];
            for (let i = 0; i < this.state.checked.length; i++) {
              if (this.state.checked[i]) selected.push(allTagsItem[i].tagId);
            }
            this.props.setState({
              page: 'home',
              unconfirmedTags: selected,
              unconfirmedNone: this.state.noneSelected,
            });
          }}>
          <View style={styles2.header}>
            <Icon style={{ marginRight: 2 }} name="cog" type="font-awesome" />
            <Text style={styles1.headerTxt}>Tags</Text>
            <Icon
              style={{ marginLeft: 6 }}
              name="caret-down"
              type="font-awesome"
            />
          </View>
        </TouchableOpacity>

        <FlatList
          data={[...allTagsItem, { tagName: 'No Tags', id: -1 }]}
          renderItem={({ item }) => {
            if (item.id == -1) {
              return (
                <CheckBox
                  style={{ height: 20 }}
                  title={item.tagName}
                  checked={this.state.noneSelected}
                  onPress={() => {
                    this.setState((state) => ({
                      noneSelected: !state.noneSelected,
                    }));
                  }}
                />
              );
            } else
              return (
                <CheckBox
                  style={{ height: 20 }}
                  title={item.tagName}
                  checked={this.state.checked[item.id]}
                  onPress={() => {
                    this.handlePress(item.id);
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
              let selected = [];
              for (let i = 0; i < this.state.checked.length; i++) {
                if (this.state.checked[i]) selected.push(allTagsItem[i].tagId);
              }
              if (!this.props.pickedTags) {
                this.props.setState({ pickedTags: true });
              }
              this.props.setState(
                {
                  page: 'home',
                  pickTagsActive: false,
                  selectedTags: selected,
                  unconfirmedTags: [],
                  noneSelected: this.state.noneSelected,
                },
                () => {
                  this.props.getDishes();
                }
              );
            }}>
            <Text style={styles1.bodyTxt}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              this.props.setState({ page: 'deleteTags' });
            }}>
            <Text style={styles1.bodyTxt}>Delete Tags</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              this.props.setState({
                page: 'home',
                pickTagsActive: false,
                unconfirmedTags: [],
              });
            }}>
            <Text style={styles1.bodyTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
