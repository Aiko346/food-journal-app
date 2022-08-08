import { CheckBox } from 'react-native-elements';

export default function CheckBox2(props) {
  return (
    <CheckBox 
      title={props.title}
      checked={props.checked}
      onPress={() => {props.onPress(props.id);}}
    />
  );
}