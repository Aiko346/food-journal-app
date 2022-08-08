import * as React from 'react';
import {
  Text,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ThemeProvider } from 'react-native-elements';
import Home from './components/Home';
import Dish from './components/Dish';
import AddDish from './components/AddDish';
import PickTags from './components/PickTags';
import Edit from './components/Edit';
import DeleteTags from './components/DeleteTags';
const backgroundColor = '#d9d9d9';

const theme = {
  CheckBox: {
    containerStyle: { marginLeft: 0 },
  },
};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      page: 'home', //current part of the app that is open
      database: null,
      openId: null, //which dish is currently open
      unconfirmedTags: [], //tags currently selected but unconfirmed
      selectedTags: [], //tags currently selected
      noneSelected: true,
      unconfirmedNone: true,
      pickTagsActive: false, //whether select tags screen is currently open
      pickTagsContinue: false, //whether pickTags opened anew or reopened
      pickedTags: false, //whether tags picked before in this session
      //info about currently open dish:
      openImage: null,
      openName: null,
      openDate: null,
      openTags: null,
      openDesc: null,
      //info retrieved about selected dishes from database:
      dishNames: [],
      dishDates: [],
      dishDescs: [],
      dishImgs: [],
      dishIds: [],
      dishTags: [],
      newTags: [], //created tags on add dish page
      checked: [], //checked tags on add dish page
      newChecked: [], //checked new tags on add dish page
      newTag: null, //new tag currently being created
      addDishActive: false, //whether add dish screen is currently open
      allTags: [], //all tags saved
      allTagIds: [], //all tag ids saved
      //info being added on add dish screen:
      dishImage: null,
      dishName: null,
      dishDesc: null,
      dishDate: null
    };
    this.updateState = this.updateState.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.takePhoto = this.takePhoto.bind(this);
    this.createDatabase = this.createDatabase.bind(this);
    this.addDish = this.addDish.bind(this);
    this.getAllTags = this.getAllTags.bind(this);
    this.getDishes = this.getDishes.bind(this);
    this.resetInfo = this.resetInfo.bind(this);
    this.deleteDish = this.deleteDish.bind(this);
    this.deleteTags = this.deleteTags.bind(this);
    this.editDish = this.editDish.bind(this);
    this.editDishTags = this.editDishTags.bind(this);
    this.createId = this.createId.bind(this); //returns a promise to return an ID
    this.getDishIdsFromTagIds = this.getDishIdsFromTagIds.bind(this);
    this.createDatabase();
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  async createDatabase() {
    let db = await SQLite.openDatabase('foodJournalApp');
    this.setState({ database: db }, () => {
      this.state.database.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS next_id (id TEXT PRIMARY KEY)',
          null,
          (tx, s) => {
            tx.executeSql('SELECT * FROM next_id', null, (tx, s) => {
              if (s.rows.length === 0) {
                tx.executeSql('INSERT INTO next_id VALUES ( ? )', ['id0']);
              }
            });
          }
        );
      });

      this.state.database.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS all_tags (tag TEXT PRIMARY KEY, id TEXT)',
          null,
          (tx, s) => {
            this.getAllTags();
          }
        );
      });

      //create table to hold dishes if not exist
      this.state.database.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS dishes (id TEXT PRIMARY KEY, date TEXT, desc TEXT, image TEXT, name TEXT)',
          null,
          () => {
            this.getDishes();
          }
        );
      });

      this.state.database.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS no_tag (dish_id TEXT PRIMARY KEY)'
        ); //table for items with no tags
      });
    });
  }

  //returns a promise to find a new ID
  createId() {
    return new Promise((resolve, reject) => {
      this.state.database.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * from next_id',
            null,
            (tx, s) => {
              let id = s.rows.item(0).id;
              let newId = 'id' + (parseInt(id.substring(2)) + 1);
              tx.executeSql('UPDATE next_id SET id = ? WHERE id = ?', [
                newId,
                id,
              ]);
              resolve(id);
            },
            (tx, e) => {
              reject('createId() failed');
            }
          );
        },
        () => {
          reject('createId() failed');
        }
      );
    });
  }

  getDishIdsFromTagIds(tagIds) {
    return new Promise((resolve, reject) => {
      let dishIds = [];
      let c = 0;
      this.state.database.transaction(
        (tx) => {
          for (let i = 0; i < tagIds.length; i++) {
            tx.executeSql(
              'SELECT * FROM ' + tagIds[i],
              null,
              (tx, s) => {
                c++;
                for (let x = 0; x < s.rows.length; x++) {
                  dishIds.push(s.rows.item(x).dish_id);
                }
                if (c === tagIds.length) {
                  resolve(dishIds);
                }
              },
              (tx, e) => {
                reject('getDishIdsFromTagIds() failed');
              }
            );
          }
        },
        () => {
          reject('getDishIdsFromTagIds() failed');
        }
      );
    });
  }

  async addDish() {
    console.log(this.state.checked);
    console.log(this.state.newChecked);
    let id = await this.createId(); //new dish ID
    let newUri = null;
    if (this.state.dishImage != null) {
      newUri = FileSystem.documentDirectory + id;
      FileSystem.copyAsync({ from: this.state.dishImage, to: newUri });
    }

    this.state.database.transaction(async (tx) => {
      tx.executeSql('INSERT INTO dishes VALUES ( ?, ?, ?, ?, ? )', [
        id,
        this.state.dishDate,
        this.state.dishDesc,
        newUri,
        this.state.dishName,
      ]);
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ' + id + ' (tag TEXT PRIMARY KEY)'
      );
    });
    let flag1 = true;
    let flag2 = true;
    let tagIds = [];
    if (this.state.newTags != null && this.state.newTags.length > 0) {
      flag1 = false;
      for (let i = 0; i < this.state.newTags.length; i++) {
        tagIds.push(await this.createId());
      }
    }
    this.setState((state) => ({
      selectedTags: [...state.selectedTags, ...tagIds],
    }));

    this.state.database.transaction(
      (tx) => {
        if (!flag1) {
          //processes newly made tags
          for (let i = 0; i < this.state.newTags.length; i++) {
            let tagId = tagIds[i];
            tx.executeSql('INSERT OR IGNORE INTO ' + id + ' VALUES ( ? )', [
              this.state.newTags[i],
            ]);
            tx.executeSql('INSERT OR IGNORE INTO all_tags VALUES ( ?, ? )', [
              this.state.newTags[i],
              tagId,
            ]);
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS ' +
                tagId +
                ' (dish_id TEXT PRIMARY KEY)'
            );
            tx.executeSql('INSERT INTO ' + tagId + ' VALUES ( ? )', [id]);
          }
        }

        //processes adding old dish tags to new dishes
        if (this.state.dishTag != null && this.state.dishTag.length > 0) {
          flag2 = false;
          for (let i = 0; i < this.state.dishTag.length; i++) {
            tx.executeSql(
              'SELECT * FROM all_tags WHERE tag = ?',
              [this.state.dishTag[i]],
              (tx, s) => {
                let tagId = s.rows.item(0).id;
                tx.executeSql('INSERT INTO ' + tagId + ' VALUES ( ? )', [id]);
              }
            );
            tx.executeSql('INSERT INTO ' + id + ' VALUES ( ? )', [
              this.state.dishTag[i],
            ]);
          }
        }

        //processes dish with no tags
        if (flag1 && flag2) {
          tx.executeSql('INSERT INTO no_tag VALUES ( ? )', [id]);
        }
      },
      () => {
        this.setState({
          page: 'home',
          dishDate: null,
          dishDesc: null,
          dishImage: null,
          dishName: null,
          addDishActive: false,
          dishTag: null,
          newTags: [],
        });
      },
      () => {
        this.setState({
          page: 'home',
          dishDate: null,
          dishDesc: null,
          dishImage: null,
          dishName: null,
          addDishActive: false,
          dishTag: null,
          newTags: [],
        });
      }
    );
    this.getAllTags();
    this.getDishes();
  }

  getAllTags(func) {
    const tags = [];
    const tagIds = [];
    this.state.database.transaction((tx) => {
      tx.executeSql('SELECT * FROM all_tags', null, (tx, s) => {
        for (let i = 0; i < s.rows.length; i++) {
          tags.push(s.rows.item(i).tag);
          tagIds.push(s.rows.item(i).id);
        }
        this.setState({ allTags: tags, allTagIds: tagIds });
        //handles putting all tags into selected to begin with on app startup
        if (!this.state.pickedTags) {
          this.setState({ selectedTags: [...tagIds] }, () => {
            this.getDishes();
          });
        }
        if (func != null) {
          func();
        }
      });
    });
  }

  //gets dishes currently under selectedTags
  getDishes() {
    const selectedDishes = [];
    //get id's of dishes need to get
    this.state.database.transaction((tx) => {
      //tagged dishes
      for (let i = 0; i < this.state.selectedTags.length; i++) {
        tx.executeSql(
          'SELECT * FROM ' + this.state.selectedTags[i],
          null,
          (tx, s) => {
            for (let j = 0; j < s.rows.length; j++) {
              if (!selectedDishes.includes(s.rows.item(j).dish_id)) {
                selectedDishes.push(s.rows.item(j).dish_id);
              }
            }
          }
        );
      }

      if (this.state.noneSelected) {
        tx.executeSql('SELECT * FROM no_tag', null, (tx, s) => {
          for (let j = 0; j < s.rows.length; j++) {
            selectedDishes.push(s.rows.item(j).dish_id);
          }
        });
      }
    });

    const names = [];
    const descs = [];
    const dates = [];
    const images = [];
    const ids = [];
    const tags = [];
    let successCount2 = 0;
    this.state.database.transaction((tx) => {
      if (selectedDishes.length == 0) {
        this.setState({
          dishNames: names,
          dishDescs: descs,
          dishDates: dates,
          dishImgs: images,
        });
      } else {
        for (let k = 0; k < selectedDishes.length; k++) {
          tx.executeSql(
            'SELECT * FROM dishes WHERE id = ?',
            [selectedDishes[k]],
            (tx, s) => {
              names.push(s.rows.item(0).name);
              descs.push(s.rows.item(0).desc);
              dates.push(s.rows.item(0).date);
              images.push(s.rows.item(0).image);
              ids.push(s.rows.item(0).id);
              successCount2++;
              if (successCount2 == selectedDishes.length) {
                this.setState({
                  dishNames: names,
                  dishDescs: descs,
                  dishDates: dates,
                  dishImgs: images,
                  dishIds: ids,
                });
              }
            }
          );
        }
      }
    });

    //get all tags of each selected dish
    let successCount = 0;
    this.state.database.transaction((tx) => {
      for (let k = 0; k < ids.length; k++) {
        tx.executeSql('SELECT * FROM ' + ids[k], null, (tx, s2) => {
          successCount++;
          let dishTags = [];
          for (let j = 0; j < s2.rows.length; j++) {
            dishTags.push(s2.rows.item(j).tag);
          }
          tags.push(dishTags);
          if (successCount == ids.length) {
            this.setState({ dishTags: tags });
          }
        });
      }
    });
  }

  editDish(id, date, desc, image, name) {
    this.state.database.transaction((tx) => {
      tx.executeSql(
        'UPDATE dishes SET date = ?, desc = ?, image = ?, name = ? WHERE id = ?',
        [date, desc, image, name, id],
        (tx, s) => {
          this.getDishes();
        }
      );
    });
  }

  //problem when adding a brand new tag from edit screen
  editDishTags(id, oldTags, newTags, newTagIds) {
    //make dish table id's match old tags, make tag table's match
    //make dish table match its new set of tags
    let removed = []; //tags to be removed
    let applied = []; //everything currently tagged on the dish
    let newApplied = []; //everything already-made being added to the dish
    this.state.database.transaction((tx) => {
      tx.executeSql('SELECT * FROM ' + id, null, (tx, s) => {
        for (let i = 0; i < s.rows.length; i++) {
          if (!oldTags.includes(s.rows.item(i).tag)) {
            removed.push(s.rows.item(i).tag);
          }
          applied.push(s.rows.item(i).tag);
        }
        for (let i = 0; i < oldTags.length; i++) {
          if (!applied.includes(oldTags[i])) {
            //add already-made tags to dish table
            tx.executeSql('INSERT INTO ' + id + ' VALUES ( ? )', [oldTags[i]]);
            newApplied.push(oldTags[i]);
          }
        }
        //take care of no tag possibility
        if (oldTags.length + newTags.length == 0 && applied.length != 0) {
          tx.executeSql('INSERT INTO no_tag VALUES ( ? )', [id]);
        }
        if (applied.length == 0 && oldTags.length + newTags.length != 0) {
          tx.executeSql('DELETE FROM no_tag WHERE dish_id = ?', [id]);
        }
        //remove dish from tag tables it is no longer in
        //remove deleted tags from dish table
        let removedIds = [];
        let c = 0;
        for (let i = 0; i < removed.length; i++) {
          tx.executeSql('DELETE FROM ' + id + ' WHERE tag = ?', [removed[i]]);
          tx.executeSql(
            'SELECT * FROM all_tags WHERE tag = ?',
            [removed[i]],
            (tx, s) => {
              removedIds.push(s.rows.item(0).id);
              if (c === removed.length - 1) {
                for (let j = 0; j < removedIds.length; j++) {
                  tx.executeSql(
                    'DELETE FROM ' + removedIds[j] + ' WHERE dish_id = ?',
                    [id]
                  );
                }
              }
              c++;
            }
          );
        }

        //add dish to already-made tag tables
        for (let i = 0; i < newApplied.length; i++) {
          tx.executeSql(
            'SELECT * FROM all_tags WHERE tag = ?',
            [newApplied[i]],
            (tx, s) => {
              tx.executeSql(
                'INSERT INTO ' + s.rows.item(0).id + ' VALUES ( ? )',
                [id]
              );
            }
          );
        }
      });
    });

    //add new tags to all_tags
    this.state.database.transaction((tx) => {
      for (let i = 0; i < newTags.length; i++)
        tx.executeSql('INSERT INTO all_tags VALUES ( ?, ? )', [
          newTags[i],
          newTagIds[i],
        ]);
    });

    //make tag tables for newly made tags
    //add dish to newly made tag tables
    //add newly-made tags to dish
    this.state.database.transaction((tx) => {
      for (let i = 0; i < newTagIds.length; i++) {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS ' +
            newTagIds[i] +
            ' (dish_id TEXT PRIMARY KEY)'
        );
        tx.executeSql('INSERT INTO ' + newTagIds[i] + ' VALUES ( ? )', [id]);
        tx.executeSql('INSERT INTO ' + id + ' VALUES ( ? )', [newTags[i]]);
      }
    });

    //reset home view and global tags state
    this.getDishes();
    this.getAllTags();
    this.setState((state) => ({
      selectedTags: [...state.selectedTags, ...newTagIds],
      openTags: [...oldTags, ...newTags],
    }));
  }

  updateState(update, func) {
    if (func != null) {
      this.setState(update, () => {
        func();
      });
    } else {
      this.setState(update);
    }
  }

  async deleteTags(tags, tagIds) {
    //get all dishes that have this tag, remove the tag from their dishtable, then drop tag table and drop this from tag table
    //!!if last tag on something is removed, need to add it to no_tag so it still gets displayed
    //get all dishes that have each tag
    //remove tag from the dish tables
    //drop tag table
    //drop tag from tag table
    let removeSelected = [];
    for (let i = 0; i < tagIds.length; i++) {
      if (this.state.selectedTags.indexOf(tagIds[i]) != -1) {
        removeSelected.push(this.state.selectedTags.indexOf(tagIds[i]));
      }
      let dishIds = await this.getDishIdsFromTagIds([tagIds[i]]);
      this.state.database.transaction(
        (tx) => {
          for (let j = 0; j < dishIds.length; j++) {
            tx.executeSql('DELETE FROM  ' + dishIds[j] + ' WHERE tag = ?', [
              tags[i],
            ]);
            tx.executeSql('SELECT * FROM ' + dishIds[j], null, (tx, s) => {
              if (s.rows.length == 0) {
                //handles case where removal causes dish to move to no_tag
                tx.executeSql('INSERT INTO no_tag VALUES ( ? )', [dishIds[j]]);
              }
            });
          }
          tx.executeSql('DROP TABLE IF EXISTS ' + tagIds[i]);
          tx.executeSql('DELETE FROM all_tags WHERE tag = ?', [tags[i]]);
        },
        () => {},
        () => {
          this.getAllTags();
          this.getDishes();
        }
      );
    }
    let newSelectedTags = [];
    let x = 0;
    this.state.selectedTags.map((elem, i) => {
      if (elem != removeSelected[x]) {
        newSelectedTags.push(elem);
      } else {
        x++;
      }
    });
    this.setState({ selectedTags: newSelectedTags }, () => {
      this.getAllTags();
      this.getDishes();
    });
  }

  deleteDish(dishId, tagNames) {
    //remove dish from dishes
    //check if its table exists; if not, must be in none_tag > remove t
    //if it does exist, get its ID's and remove them
    //reset home display
    //remove from its tag tables
    //delete its tag table
    let tagIds = [];
    this.state.database.transaction((tx) => {
      tx.executeSql('DELETE FROM dishes WHERE id = ?', [dishId]);
      if (tagNames == null || tagNames.length == 0) {
        tx.executeSql('DELETE FROM no_tag WHERE dish_id = ?', [dishId]);
      } else {
        for (let i = 0; i < tagNames.length; i++) {
          tx.executeSql(
            'SELECT * FROM all_tags WHERE tag = ?',
            [tagNames[i]],
            (tx, s) => {
              if (s.rows.length > 0) {
                tx.executeSql(
                  'DELETE FROM ' + s.rows.item(0).id + ' WHERE dish_id = ?',
                  [dishId]
                );
              }
            }
          );
        }
      }
      tx.executeSql('DROP TABLE IF EXISTS ' + dishId, null, () => {
        this.getDishes();
      });
    });
  }

  resetInfo() {
    this.setState({
      journalTitles: [],
      journalImgs: [],
      dishNames: [],
      dishImage: [],
      dishDesc: [],
      dishDate: [],
    });
  }

  async pickImage(setImgState) {
    let permit = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (permit.status !== 'granted') {
      permit = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (permit.status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        setImgState(result.uri);
      }
    }
  }

  async takePhoto(setImgState) {
    //requires camera and camera roll permissions
    let permit = await ImagePicker.getCameraPermissionsAsync();
    if (permit.status !== 'granted') {
      permit = await ImagePicker.requestCameraPermissionsAsync();
    }

    if (permit.status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.cancelled) {
        setImgState(result.uri);
      }
    }
  }

  render() {
    let output = null;
    let journalCards = [];
    let openDishes = [];
    for (let i = 0; i < this.state.dishNames.length; i++) {
      openDishes.push({
        name: this.state.dishNames[i],
        desc: this.state.dishDescs[i],
        date: this.state.dishDates[i],
        image: this.state.dishImgs[i],
        id: this.state.dishIds[i],
        tags: this.state.dishTags[i],
        setState: this.updateState,
        cardId: i,
        addDishActive: this.state.addDishActive,
      });
    }

    if (this.state.page === 'home') {
      output = (
        <Home
          openDishes={openDishes}
          addDishActive={this.state.addDishActive}
          pickTagsActive={this.state.pickTagsActive}
          setState={this.updateState}
        />
      );
    } else if (this.state.page === 'addDish') {
      output = (
        <AddDish
          setState={this.updateState}
          dishImage={this.state.dishImage}
          dishName={this.state.dishName}
          // dishTag={this.state.dishTag}
          dishDate={this.state.dishDate}
          dishDesc={this.state.dishDesc}
          takePhoto={this.takePhoto}
          pickImage={this.pickImage}
          addDish={this.addDish}
          getAllTags={this.getAllTags}
          allTags={this.state.allTags}
          newTag={this.state.newTag}
          newChecked={this.state.newChecked}
          checked={this.state.checked}
          newTags={this.state.newTags}
        />
      );
    } else if (this.state.page === 'dish') {
      output = (
        <Dish
          setState={this.updateState}
          image={this.state.openImage}
          name={this.state.openName}
          date={this.state.openDate}
          desc={this.state.openDesc}
          id={this.state.openId}
          tags={this.state.openTags}
          deleteDish={this.deleteDish}
        />
      );
    } else if (this.state.page === 'pickTags') {
      let arr = [];
      let arr2 = [];
      let noneSelected = null;
      if (!this.state.pickTagsContinue) {
        this.state.allTags.map((item, i) => {
          arr.push({ tagName: item, tagId: this.state.allTagIds[i], id: i });

          if (
            this.state.selectedTags != null &&
            this.state.selectedTags.includes(this.state.allTagIds[i])
          )
            arr2.push(true);
          else arr2.push(false);
        });
        noneSelected = this.state.noneSelected;
      } else {
        this.state.allTags.map((item, i) => {
          arr.push({ tagName: item, tagId: this.state.allTagIds[i], id: i });
          if (
            this.state.unconfirmedTags != null &&
            this.state.unconfirmedTags.includes(this.state.allTagIds[i])
          )
            arr2.push(true);
          else arr2.push(false);
        });
        noneSelected = this.state.unconfirmedNone;
      }
      output = (
        <PickTags
          setState={this.updateState}
          allTags={this.state.allTags}
          allTagIds={this.state.allTagIds}
          selectedTags={this.state.selectedTags}
          unconfirmedTags={this.state.unconfirmedTags}
          pickTagsContinue={this.state.pickTagsContinue}
          pickedTags={this.state.pickedTags}
          getDishes={this.getDishes}
          allTagsItem={arr}
          checked={arr2}
          noneSelected={noneSelected}
        />
      );
    } else if (this.state.page === 'edit') {
      output = (
        <Edit
          setState={this.updateState}
          image={this.state.openImage}
          name={this.state.openName}
          date={this.state.openDate}
          desc={this.state.openDesc}
          id={this.state.openId}
          tags={this.state.openTags}
          deleteDish={this.deleteDish}
          takePhoto={this.takePhoto}
          pickImage={this.pickImage}
          editDish={this.editDish}
          allTags={this.state.allTags}
          allTagIds={this.state.allTagIds}
          openTags={this.state.openTags}
          editDishTags={this.editDishTags}
          createId={this.createId}
        />
      );
    } else if (this.state.page === 'deleteTags') {
      output = (
        <DeleteTags
          deleteTags={this.deleteTags}
          allTagIds={this.state.allTagIds}
          allTags={this.state.allTags}
          setState={this.updateState}
          getDishes={this.getDishes}
          getAllTags={this.getAllTags}
        />
      );
    } else {
      output = <Text> Error, try restarting. </Text>;
    }

    return (
      <ThemeProvider theme={theme}>
        <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
          {output}
        </SafeAreaView>
      </ThemeProvider>
    );
  }
}
