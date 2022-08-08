import * as React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';

import { styles1 } from './Styles';

export default class Dish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
    };
  }

  render() {
    return (
      <View style={styles1.mainContainer}>
        <Modal
          visible={this.state.deleteModal}
          transparent={true}
          animationType="slide">
          <View style={styles1.modalContainer}>
            <View style={styles1.modalCard}>
              <View style={{ width: '90%', marginBottom: '10%' }}>
                <Text style={[styles1.headerTxt, { textAlign: 'center' }]}>
                  Are you sure you want to delete this?
                </Text>
              </View>
              <View style={styles1.optionContainer}>
                <TouchableOpacity
                  onPress={(e) => {
                    this.setState({ deleteModal: false });
                    this.props.deleteDish(this.props.id, this.props.tags);
                    this.props.setState({ page: 'home' });
                  }}>
                  <Text style={styles1.bodyTxt}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => {
                    this.setState({ deleteModal: false });
                  }}>
                  <Text style={styles1.bodyTxt}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles1.header}>
          <Text style={styles1.headerTxt}>{this.props.name}</Text>
        </View>
        <View style={styles1.contentContainer}>
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={{ marginLeft: '5%', width: '90%'}}>
            <View
              style={{
                marginBottom: 20,
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <Image
                source={{ uri: this.props.image }}
                style={[styles1.image]}
              />
              <View style={{ flexGrow: 1, flexShrink: 1, paddingLeft: 10, paddingRight: 10 }}>
                <Text style={styles1.bodyTxt}>{this.props.date}</Text>
                <Text style={styles1.bodyTxt}>
                  {this.props.tags != null &&
                    this.props.tags.map((e, i) => {
                      if (i != this.props.tags.length - 1) return e + ', ';
                      else return e;
                    })}
                </Text>
              </View>
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={styles1.bodyTxt}>{this.props.desc}</Text>
            </View>
          </ScrollView>
        </View>
        <View style={styles1.optionContainer}>
          <TouchableOpacity
            style={styles1.iconOption}
            onPress={(e) => {
              this.props.setState({ page: 'edit' });
            }}>
            <Icon
              style={{ marginRight: '2px' }}
              name="cog"
              type="font-awesome"
            />
            <Text style={styles1.bodyTxt}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              this.props.setState({ page: 'home' });
            }}>
            <Text style={styles1.bodyTxt}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => {
              this.setState({ deleteModal: true });
            }}>
            <Text style={styles1.bodyTxt}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
