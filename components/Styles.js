import { StyleSheet } from 'react-native';

const backgroundColor = '#d9d9d9';

const styles1 = StyleSheet.create({
  //landing page type styles
  mainContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: backgroundColor,
  },
  header: {
    height: '7%',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contentContainer: {
    height: '86%',
    width: '100%',
  },
  iconOption: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerTxt: {
    fontSize: 28,
  },
  subheaderTxt: {
    fontSize: 22,
  },
  bodyTxt: {
    fontSize: 17,
  },
  headlineTxt: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  jBoxImage: {
    marginLeft: 20,
    marginRight: 20,
    width: 80,
    height: 80,
    backgroundColor: 'white',
  },
  optionContainer: {
    height: '7%',
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapsedAddJournal: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '7%',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '80%',
    height: '40%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  image: {
    width: 90,
    height: 90,
    backgroundColor: 'blue',
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    display: 'inline-block',
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
  },
});

const styles2 = StyleSheet.create({
  //add dish type styles
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  optionBox: {
    height: 125,
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textInput: {
    height: 100,
    marginTop: 6,
  },
  contentAligner: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentSizer: {
    height: '100%',
    width: '90%',
  },
  flatList: {
    height: '86%',
    width: '90%',
  },
});

const styles3 = StyleSheet.create({
  //for dish card
  dishBox: {
    backgroundColor: '#CC693F',
    height: 160,
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftBox: {
    height: '100%',
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  imageBox: {
    width: '80%',
    height: '60%',
  },
  title: {
    height: '10%',
    marginBottom: '8%',
    width: '90%',
  },
  rightBox: {
    height: '100%',
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  captionTxt: {
    fontSize: 12,
  },
  dateBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '12%',
    paddingRight: 8,
  },
  descBox: {
    overflow: 'hidden',
    height: '76%',
    width: '100%',
    paddingRight: 8,
  },
  tagBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '12%',
    paddingRight: 8,
  },
});

export { styles1 };
export { styles2 };
export { styles3 };
