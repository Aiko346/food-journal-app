import {
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { styles1, styles3 } from './Styles';

//display card for dishes
export default function DishCard(props) {
  return (
    <TouchableOpacity
      style={styles3.dishBox}
      onPress={(e) => {
        props.setState({
          page: 'dish',
          openId: props.id,
          openDate: props.date,
          openName: props.name,
          openDesc: props.desc,
          openTags: props.tags,
          openImage: props.image,
        });
      }}>
      <View style={styles3.leftBox}>
        <View style={styles3.title}>
          <Text style={[styles1.headlineTxt, { textAlign: 'center' }]}>
            {props.name}
          </Text>
        </View>
        <View style={styles3.imageBox}>
          <Image source={{ uri: props.image }} style={styles3.image} />
        </View>
      </View>
      <View style={styles3.rightBox}>
        <View style={styles3.dateBox}>
          <Text
            style={[
              styles3.captionTxt,
              {
                textAlign: 'right',
              },
            ]}>
            {props.date}
          </Text>
        </View>
        <View style={styles3.descBox}>
          <Text style={styles1.bodyTxt}>{props.desc}</Text>
        </View>
        <View style={styles3.tagBox}>
          <Text
            style={[
              styles3.captionTxt,
              {
                textAlign: 'right',
              },
            ]}>
            {props.tags != null &&
              props.tags.map((e, i) => {
                if (i != props.tags.length - 1)
                  return e + ', ';
                else 
                  return e;
              })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
