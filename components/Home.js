import {
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Icon } from 'react-native-elements';

import { styles1 } from './Styles';
import DishCard from './DishCard';

export default function Home(props) {
  return (
    <View style={styles1.mainContainer}>
      <View style={styles1.header}>
        <Text style={styles1.headerTxt}>Food Journal</Text>
      </View>

      <FlatList
        data={props.openDishes}
        renderItem={({ item }) => {
          return (
            <DishCard
              name={item.name}
              desc={item.desc}
              date={item.date}
              image={item.image}
              id={item.id}
              tags={item.tags}
              setState={item.setState}
              cardId={item.cardId}
              addDishActive={item.addDishActive}
            />
          );
        }}
        ItemSeparatorComponent={() => {
          return <View style={{ height: 40 }}></View>;
        }}
        initialNumToRender={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ alignItems: 'center' }}
        style={styles1.contentContainer}
      />

      {!props.addDishActive && !props.pickTagsActive ? (
        <View style={styles1.optionContainer}>
          <TouchableOpacity
            onPress={(e) => {
              props.setState({ page: 'addDish', addDishActive: true });
            }}>
            <Text style={styles1.bodyTxt}>Add Dish</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles1.iconOption}
            onPress={(e) => {
              props.setState({
                page: 'pickTags',
                pickTagsActive: true,
                pickTagsContinue: false,
              });
            }}>
            <Icon
              style={{ marginRight: '2px' }}
              name="cog"
              type="font-awesome"
            />
            <Text style={styles1.bodyTxt}>Tags</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {props.addDishActive ? (
        <TouchableOpacity
          style={styles1.collapsedAddJournal}
          onPress={(e) => {
            props.setState({ page: 'addDish' });
          }}>
          <Text style={styles1.headerTxt}>Add Dish</Text>
          <Icon
            style={{ marginLeft: '6px' }}
            name="caret-up"
            type="font-awesome"
          />
        </TouchableOpacity>
      ) : null}
      {props.pickTagsActive ? (
        <TouchableOpacity
          style={styles1.collapsedAddJournal}
          onPress={(e) => {
            props.setState({ page: 'pickTags', pickTagsContinue: true });
          }}>
          <Icon style={{ marginRight: '2px' }} name="cog" type="font-awesome" />
          <Text style={styles1.headerTxt}>Tags</Text>
          <Icon
            style={{ marginLeft: '6px' }}
            name="caret-up"
            type="font-awesome"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
