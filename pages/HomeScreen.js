import React, { useState, useEffect, useRef } from 'react';
import { Platform, SectionList, FlatList, SafeAreaView, StyleSheet, Text, Modal, Pressable, Dimensions, Touchable, LogBox, Button, View, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import Task from '../components/Task';
import ScheduleOption from '../components/ScheduleOption';
import { MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import KeyboardListener from 'react-native-keyboard-listener';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import Collapsible from 'react-native-collapsible';

import { db } from '../firebase'

const HomeScreen = ({ navigation, route }) => {
  const userID = route.params.userId;
  const username = route.params.username;
  const userEmail = route.params.userEmail;

  const [forceUpdate, setForceUpdate] = useState(0);

  const [task, setTask] = useState();
  const [schedule, setSchedule] = useState("default");

  const [todayTaskItems, setTodayTaskItems] = useState([]);
  const [tomorrowTaskItems, setTomorrowTaskItems] = useState([])
  const [nextWeekTaskItems, setNextWeekTaskItems] = useState([]);


  // MARK: Ignore Warning
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'componentWillMount has been renamed, and is not recommended for use'
  ]);


  //#region - Handle Collapsible Section List
  const [collapsed, setCollapsed] = useState(false);
  const [tomorrowItemsCollapsed, setTomorrowItemsCollapsed] = useState(false);
  const [nextWeekItemsCollapsed, setNextWeekItemsCollapsed] = useState(false);
  const toggleExpanded = (title) => {
    //Toggling the state of single Collapsible
    if (title == "TODAY") {
      setCollapsed(!collapsed);
    } else if (title == "TOMORROW") {
      setTomorrowItemsCollapsed(!tomorrowItemsCollapsed);
    } else {
      setNextWeekItemsCollapsed(!nextWeekItemsCollapsed);
    }
  };

  const showAddTaskBtn = (title) => {
    if (title == "TODAY") {
      if (collapsed == false) {
        return 0; //ADD TASK BUTTON
      } else {
        if (todayTaskItems.length == 0) {
          return 1; //EMPTY
        }
        return 2; //COUNT
      }
    }
    if (title == "TOMORROW") {
      if (tomorrowItemsCollapsed == false) {
        return 0; //ADD TASK BUTTON
      } else {
        if (tomorrowTaskItems.length == 0) {
          return 1; //EMPTY
        }
        return 2; //COUNT
      }
    }
    if (title == "UPCOMING") {
      if (nextWeekItemsCollapsed == false) {
        return 0; //ADD TASK BUTTON
      } else {
        if (nextWeekTaskItems.length == 0) {
          return 1; //EMPTY
        }
        return 2; //COUNT
      }
    }
  }
//#endregion


  //#region - Handle Set Custome Schedule
  const [keyboardStatus, setKeyboardStatus] = useState("hide");

  /*Date Time Picker*/
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [customSchedule, setCustomSchedule] = useState();

  const onChangeDatetime = (event, value) => {
    setDate(value);
  };

  const confirmCustomSchedule = () => {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    setCustomSchedule(day + "/" + month + "/" + year + " " + hour + ":" + minutes);
  };

  const [isInputFocused, setInputFocused] = useState(false);
  const [isModalInputFocused, setModalInputFocused] = useState(false);

  const inputRef = useRef(null);
  const modalInputRef = useRef(null);

  useEffect(() => {
    //console.log(isInputFocused);
    isInputFocused ? inputRef.current.focus() : inputRef.current.blur();
  }, [isInputFocused]);

  useEffect(() => {
    if (Platform.OS === "ios") {
      if (modalVisible == true) {
        isModalInputFocused ? modalInputRef.current.focus() : modalInputRef.current.blur();
      }
    }
  }, [isModalInputFocused]);

  const handleInputFocus = () => setInputFocused(true);
  const handleInputBlur = () => setInputFocused(false);

  const handleModalInputFocus = () => setModalInputFocused(true);
  const handleModalInputBlur = () => setModalInputFocused(false);

  const handleOpenModalPress = () => {
    inputRef.current.blur();
    setModalVisible(true);
  };

  const handleCloseModalPress = () => {
    setModalVisible(false);
    inputRef.current.blur();
  }

  const switchSchedule = () => {
    setInputFocused(true);
    setModalVisible(false);
  }

  useEffect(() => {
    if (modalVisible == true) {
      setModalInputFocused(true);
    } else {
      setModalInputFocused(false);
    }
  }, [modalVisible]);


  useEffect(() => {
    if (schedule == custom && keyboardStatus == "show" && modalVisible == false && isInputFocused == true) {
      handleOpenModalPress();
    }
  });
  //#endregion


  //#region - Handle Set Defined Schedule
  const today = new Date();
  const laterToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + 4, 0).toLocaleString();
  const thisEvening = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0).toLocaleString();

  const tmr = new Date(today);
  tmr.setDate(tmr.getDate() + 1);
  const tomorrow = new Date(tmr.getFullYear(), tmr.getMonth(), tmr.getDate(), 9, 0).toLocaleString();

  const dayOfWeek = today.getDay();
  const dateOfSunday = new Date();
  dateOfSunday.setDate(today.getDate() + 7 - dayOfWeek);
  const nextWeek = new Date(dateOfSunday.getFullYear(), dateOfSunday.getMonth(), dateOfSunday.getDate(), 9, 1).toLocaleString();

  const someday = "Someday";
  const custom = "Custom";

  const getDisplayText = (assignedSchedule) => {
    switch (assignedSchedule) {
      case laterToday:
        return "Today, " + (today.getHours() + 4) + ":00";
      case thisEvening:
        return "Today, 18:00";
      case tomorrow:
        return tmr.toLocaleString('en-us', { weekday: 'long' }) + ", 09:00";
      case nextWeek:
        return "Sunday, 09:00";
      case "default":
        return "Today"
      default:
        return ""
    }
  }

  const assignSchedule = (option) => {
    if (schedule != option) {
      setSchedule(option);
    } else {
      setSchedule("default");
    }
  }
  //#endregion


  //#region - Loading Docs from Firestore
  /*Load Today Tasks*/
  useEffect(() => {
    db.collection("Tasks").doc(userID).collection('TodayTasks')
      .get()
      .then((querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push(doc.data());
        });
        setTodayTaskItems(tasks)
      })
  }, []);

  /*Load Tomorrow Tasks*/
  useEffect(() => {
    db.collection("Tasks").doc(userID).collection('TomorrowTasks')
      .get()
      .then((querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push(doc.data());
        });
        setTomorrowTaskItems(tasks)
      })
  }, []);

  /*Load Next Week Tasks*/
  useEffect(() => {
    db.collection("Tasks").doc(userID).collection('NextWeekTasks')
      .get()
      .then((querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push(doc.data());
        });
        setNextWeekTaskItems(tasks)
      })
  }, []);
  //#endregion


 //#region - Handle Add Task
 const handleAddTask = () => {
  if (task != "" && task != null) {
    /*Update todayTaskItems array*/
    if (schedule == laterToday || schedule == thisEvening || schedule == "default") {
      const id = todayTaskItems.length + 1;
      const newTask = {
        id: id,
        taskName: task,
        status: "pending",
        schedule: schedule,
        subtasks: {
          subtaskItems: [],
          subtaskItemsStatus: []
        },
        note: "",
        creationTimestamp: new Date(),
        lastUpdatedTimestamp: new Date()
      }

      const newTodayTaskItemsArray = [
        newTask,
        ...todayTaskItems
      ];
      setTodayTaskItems(newTodayTaskItemsArray);

      CreateTodayTask(newTask, id);
    }

    /*Update tomorrowTaskItems array*/
    if (schedule == tomorrow) {
      const id = tomorrowTaskItems.length + 1;
      const newTask = {
        id: id,
        taskName: task,
        status: "pending",
        schedule: schedule,
        subtasks: {
          subtaskItems: [],
          subtaskItemsStatus: []
        },
        note: "",
        creationTimestamp: new Date(),
        lastUpdatedTimestamp: new Date()
      }

      const newTomorrowTaskItemsArray = [
        newTask,
        ...tomorrowTaskItems
      ];
      setTomorrowTaskItems(newTomorrowTaskItemsArray);

      CreateTomorrowTask(newTask, id);
    }

    /*Update nextWeekTaskItems array*/
    if (schedule == nextWeek) {
      const id = nextWeekTaskItems.length + 1;
      const newTask = {
        id: id,
        taskName: task,
        status: "pending",
        schedule: schedule,
        subtasks: {
          subtaskItems: [],
          subtaskItemsStatus: []
        },
        note: "",
        creationTimestamp: new Date(),
        lastUpdatedTimestamp: new Date()
      }

      const newNextWeekTaskItemsArray = [
        newTask,
        ...nextWeekTaskItems
      ];
      setNextWeekTaskItems(newNextWeekTaskItemsArray);

      CreateNextWeekTask(newTask, id);
    }

    setSchedule("default");
    setTask(null);
  }
}
//#endregion


  //#region - Creating New Doc in Firestore
  const CreateTodayTask = (docData, taskId) => {
    /*Create New Doc for Today Task*/
    db.collection("Tasks").doc(userID).set({
      username: username, 
      email: userEmail
    }).then(() => {
      db.collection("Tasks").doc(userID).collection('TodayTasks').doc("task" + taskId).set(docData)
    })
  }

  const CreateTomorrowTask = (docData, taskId) => {
    /*Create New Doc for Tomorrow Task*/
    db.collection("Tasks").doc(userID).set({
      username: username
    }).then(() => {
      db.collection("Tasks").doc(userID).collection('TomorrowTasks').doc("task" + taskId).set(docData)
    })
  }

  const CreateNextWeekTask = (docData, taskId) => {
    /*Create New Doc for Next Week Task*/
    db.collection("Tasks").doc(userID).set({
      username: username
    }).then(() => {
      db.collection("Tasks").doc(userID).collection('NextWeekTasks').doc("task" + taskId).set(docData)
    })
  }
  //#endregion


  //#region - Handle Complete Task
  const completeTask = (taskId, schedule) => {
          //Today
    if (schedule == laterToday || schedule == thisEvening || schedule == "default") {
      const index = todayTaskItems.findIndex(task => task.id == taskId);
      const docRef = db.collection("Tasks").doc(userID).collection('TodayTasks').doc("task" + taskId);

      let todayTaskItemsCopy = [...todayTaskItems];
       //Update Firestore
      if (todayTaskItemsCopy[index].status == "completed") {
        todayTaskItemsCopy[index].status = "pending"

        docRef.update({
          status: "pending",
          lastUpdatedTimestamp: new Date()
        })
      } else {
        todayTaskItemsCopy[index].status = "completed";
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        docRef.update({
          status: "completed",
          lastUpdatedTimestamp: new Date()
        })
      }

      //Update local copy
      setTodayTaskItems(todayTaskItemsCopy);
    }

    //Tomorrow
    if (schedule == tomorrow) {
      const index = tomorrowTaskItems.findIndex(task => task.id == taskId);
      const docRef = db.collection("Tasks").doc(userID).collection('TomorrowTasks').doc("task" + taskId);

      let tomorrowTaskItemsCopy = [...tomorrowTaskItems];
       //Update Firestore
      if (tomorrowTaskItemsCopy[index].status == "completed") {
        tomorrowTaskItemsCopy[index].status = "pending"

        docRef.update({
          status: "pending",
          lastUpdatedTimestamp: new Date()
        })
      } else {
        tomorrowTaskItemsCopy[index].status = "completed";
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        docRef.update({
          status: "completed",
          lastUpdatedTimestamp: new Date()
        })
      }

      //Update local copy
      setTomorrowTaskItems(tomorrowTaskItemsCopy);
    }

    //Next Week
    if (schedule == nextWeek) {
      const index = nextWeekTaskItems.findIndex(task => task.id == taskId);
      const docRef = db.collection("Tasks").doc(userID).collection('NextWeekTasks').doc("task" + taskId);

      let nextWeekTaskItemsCopy = [...nextWeekTaskItems];
       //Update Firestore
      if (nextWeekTaskItemsCopy[index].status == "completed") {
        nextWeekTaskItemsCopy[index].status = "pending"

        docRef.update({
          status: "pending",
          lastUpdatedTimestamp: new Date()
        })
      } else {
        nextWeekTaskItemsCopy[index].status = "completed";
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        docRef.update({
          status: "completed",
          lastUpdatedTimestamp: new Date()
        })
      }

      //Update local copy
      setNextWeekTaskItems(nextWeekTaskItemsCopy);
    }
  }
  //#endregion


  //#region - Handle Delete Task
  const deleteTask = (taskId, schedule) => {
    //Today
    if (schedule == laterToday || schedule == thisEvening || schedule == "default") {
      //Update Firestore
      const index = todayTaskItems.findIndex(task => task.id == taskId);
      const docRef = db.collection("Tasks").doc(userID).collection('TodayTasks').doc("task" + taskId);

      docRef.delete();

      //Update local copy
      let todayTaskItemsCopy = [...todayTaskItems]
      todayTaskItemsCopy.splice(index, 1);
      setTodayTaskItems(todayTaskItemsCopy);
    }

    //Tomorrow
    if (schedule == tomorrow) {
      //Update Firestore
      const index = tomorrowTaskItems.findIndex(task => task.id == taskId);
      const docRef = db.collection("Tasks").doc(userID).collection('TomorrowTasks').doc("task" + taskId);

      docRef.delete();

      //Update local copy
      let tomorrowTaskItemsCopy = [...tomorrowTaskItems]
      tomorrowTaskItemsCopy.splice(index, 1);
      setTomorrowTaskItems(tomorrowTaskItemsCopy);
    }

    //Next Week 
    if (schedule == nextWeek) {
      //Update Firestore
      const index = nextWeekTaskItems.findIndex(task => task.id == taskId);
      const docRef = db.collection("Tasks").doc(userID).collection('NextWeekTasks').doc("task" + taskId);

      docRef.delete();

      //Update local copy
      let nextWeekItemsCopy = [...nextWeekTaskItems];
      nextWeekItemsCopy.splice(index, 1);
      setNextWeekTaskItems(nextWeekItemsCopy);
    }
  }
  //#endregion


  const updateTaskItems = (taskId, newTaskName, subtaskItemArray, subtaskItemStatusArray, scheduleCollection) => {
    const docRef = db.collection("Tasks").doc(userID).collection(scheduleCollection).doc("task" + taskId);

    docRef.update({
      taskName: newTaskName,
      subtasks: {
        subtaskItems: subtaskItemArray,
        subtaskItemsStatus: subtaskItemStatusArray
      },
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, isInputFocused == true || modalVisible == true ? styles.dimBackground : styles.brightBackground]}>
        <View style={{ paddingBottom: 150 }}>
          <Text style={[styles.sectionTitle, styles.tasksWrapper, isInputFocused == true || modalVisible == true ? styles.dimColor : styles.brightColor]}>
            <MaterialCommunityIcons name="text" size={32} color="#4A4A4A" />
            <Text style={{ fontSize: 24 }}>ALL TASKS</Text>
          </Text>

          <SectionList style={{ paddingHorizontal: 20 }}
            sections={[
              { title: 'TODAY', data: [...todayTaskItems] },
              { title: 'TOMORROW', data: [...tomorrowTaskItems] },
              { title: 'UPCOMING', data: [...nextWeekTaskItems] },
            ]}
            renderItem={({ item, index, section }) =>
              <Collapsible collapsed={section.title == "TODAY" ? collapsed : section.title == "TOMORROW" ? tomorrowItemsCollapsed : nextWeekItemsCollapsed}
                align="center">
                <TouchableOpacity onPress={() => {
                  setForceUpdate(forceUpdate => forceUpdate + 1);
                  navigation.navigate('Details',
                    {
                      value: forceUpdate,
                      pageToNavigate: section.title,
                      index: index,
                      taskItems: section.title == "TODAY" ? todayTaskItems : section.title == "TOMORROW" ? tomorrowTaskItems : nextWeekTaskItems,
                      setTaskItems: section.title == "TODAY" ? setTodayTaskItems : section.title == "TOMORROW" ? setTomorrowTaskItems : setNextWeekTaskItems,
                      updateTaskItems: updateTaskItems,
                    })
                }}>
                  <Task text={item.taskName} status={item.status} schedule={getDisplayText(item.schedule)} onPressSquare={() => completeTask(item.id, item.schedule)} onPressCircular={() => deleteTask(item.id, item.schedule)} />
                </TouchableOpacity>
              </Collapsible>
            }
            renderSectionHeader={({ section }) =>
              <View style={[styles.header, isInputFocused == true || modalVisible == true ? styles.dimBackground : styles.brightBackground]}>
                <TouchableOpacity onPress={() => toggleExpanded(section.title)} style={styles.collapseList} activeOpacity={1}>
                  <Text style={styles.heading}>{section.title}</Text>
                </TouchableOpacity>
                <View style={styles.addIcon}>
                  {showAddTaskBtn(section.title) == 0 &&
                    <TouchableOpacity onPress={() => navigation.navigate('AddTask', {
                      pageToNavigate: section.title,
                      taskItems: section.title == "TODAY" ? todayTaskItems : section.title == "TOMORROW" ? tomorrowTaskItems : nextWeekTaskItems,
                      setTaskItems: section.title == "TODAY" ? setTodayTaskItems : section.title == "TOMORROW" ? setTomorrowTaskItems : setNextWeekTaskItems,
                      schedule: section.title == "TODAY" ? "default" : section.title == "TOMORROW" ? tomorrow : nextWeek,
                    })}>
                      <View style={styles.addScheduledTaskWrapper}>
                        <Text><Ionicons name={"add"} size={21} color="#FFF" /></Text>
                      </View>
                    </TouchableOpacity>
                  }
                  {showAddTaskBtn(section.title) == 1 &&
                    <Text style={styles.empty}>empty</Text>
                  }
                  {showAddTaskBtn(section.title) == 2 &&
                    <View style={styles.countWrapper}>
                      <Text style={styles.empty}>{section.title == "TODAY" ? todayTaskItems.length : section.title == "TOMORROW" ? tomorrowTaskItems.length : nextWeekTaskItems.length}</Text>
                    </View>
                  }
                </View>
              </View>
            }
            keyExtractor={(item, index) => index}
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.userInputWrapper}
        >
          <View>
            {isInputFocused == true &&
              <ScrollView horizontal={true} keyboardShouldPersistTaps={'always'} style={styles.OptionWrapper}>
                <TouchableOpacity activeOpacity={1} onPress={() => { handleOpenModalPress(); assignSchedule(custom) }}>
                  <ScheduleOption text={customSchedule == null ? "Custom" : customSchedule} value={custom} selection={schedule} />
                </TouchableOpacity>

                {new Date().getHours() < 14 &&
                  <TouchableOpacity activeOpacity={1} onPress={() => assignSchedule(laterToday)}>
                    <ScheduleOption text="Later today" value={laterToday} selection={schedule} />
                  </TouchableOpacity>
                }
                {
                  <TouchableOpacity activeOpacity={1} onPress={() => assignSchedule(thisEvening)}>
                    <ScheduleOption text="This evening" value={thisEvening} selection={schedule} />
                  </TouchableOpacity>
                }
                <TouchableOpacity activeOpacity={1} onPress={() => assignSchedule(tomorrow)}>
                  <ScheduleOption text="Tomorrow" value={tomorrow} selection={schedule} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => assignSchedule(nextWeek)}>
                  <ScheduleOption text="Next week" value={nextWeek} selection={schedule} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ marginRight: 14 }} onPress={() => assignSchedule(someday)}>
                  <ScheduleOption text="Someday" value={someday} selection={schedule} />
                </TouchableOpacity>
              </ScrollView>
            }

            <View style={styles.writeTaskWrapper}>
              <TextInput ref={inputRef} onFocus={handleInputFocus} onBlur={handleInputBlur} style={styles.input} placeholder={'I want to...'} value={task} onChangeText={text => setTask(text)} />
              <TouchableOpacity activeOpacity={task != "" && task != null ? 1 : 1} onPress={() => handleAddTask()}>
                <View style={[styles.addWrapper, task != "" && task != null ? styles.orangeBgColor : styles.whiteBgColor]}>
                  <Ionicons name={isInputFocused == true ? "arrow-up-outline" : "add"} size={24} color={task != "" && task != null ? "#FFF" : "#4A4A4A"} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {Platform.OS === 'ios' &&
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModalPress}
          >
            <TouchableOpacity
              style={styles.container}
              activeOpacity={1}
              onPressOut={handleCloseModalPress}
            ></TouchableOpacity>

            <View style={{ position: 'absolute', bottom: 300 }}>
              <View style={styles.writeTaskWrapper}>
                <TextInput ref={modalInputRef} showSoftInputOnFocus={false} onFocus={handleModalInputFocus} onBlur={handleModalInputBlur} autofocus={true} style={styles.input} placeholder={'I want to...'} value={task} onChangeText={text => setTask(text)} />
                <TouchableOpacity activeOpacity={task != "" && task != null ? 1 : 1} onPress={() => handleAddTask()}>
                  <View style={[styles.addWrapper, task != "" && task != null ? styles.orangeBgColor : styles.whiteBgColor]}>
                    <Ionicons name={"arrow-up-outline"} size={24} color={task != "" && task != null ? "#FFF" : "#4A4A4A"} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.centeredView}>
              <ScrollView horizontal={true} style={[styles.OptionWrapper, { position: 'absolute', bottom: 352 }]}>
                <TouchableOpacity activeOpacity={1}
                  onPress={() => { assignSchedule(custom) }}>
                  <ScheduleOption text={customSchedule == null ? "Custom" : customSchedule} value={custom} selection={schedule} />
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={1}>
                <ScheduleOption text="Custom" isSelected={true} />
              </TouchableOpacity> */}

                {new Date().getHours() < 14 &&
                  <TouchableOpacity onPress={() => { switchSchedule(); assignSchedule(laterToday); }}>
                    <ScheduleOption text="Later today" value={laterToday} selection={schedule} />
                  </TouchableOpacity>
                }
                <TouchableOpacity activeOpacity={1} onPress={() => { switchSchedule(); assignSchedule(thisEvening); }}>
                  <ScheduleOption text="This evening" value={thisEvening} selection={schedule} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => assignSchedule(tomorrow)}>
                  <ScheduleOption text="Tomorrow" value={tomorrow} selection={schedule} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={() => assignSchedule(nextWeek)}>
                  <ScheduleOption text="Next week" value={nextWeek} selection={schedule} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={{ marginRight: 14 }} onPress={() => assignSchedule(someday)}>
                  <ScheduleOption text="Someday" value={someday} selection={schedule} />
                </TouchableOpacity>
              </ScrollView>

              <View style={styles.modalView}>
                <View style={styles.setCustomScheduleWrapper}>
                  <Text style={styles.customTimeDisplayText}>Custom Time</Text>
                  <View style={styles.confirmScheduleButton}>
                    <TouchableOpacity onPress={confirmCustomSchedule}>
                      <View style={styles.actionIcon}><AntDesign name="check" size={24} color='rgb(80, 80, 80)' /></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCloseModalPress}>
                      <View style={styles.actionIcon}><AntDesign name="close" size={24} color='rgb(164, 164, 164)' /></View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* The date picker */}
                <DateTimePicker
                  value={date}
                  mode={'datetime'}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  is24Hour={true}
                  onChange={onChangeDatetime}
                  style={styles.datePicker}
                />
              </View>
            </View>
          </Modal>
        }

        <KeyboardListener
          onWillShow={() => setKeyboardStatus("show")}
          onWillHide={() => { setKeyboardStatus("hide") }}
        />
      </View >
    </TouchableWithoutFeedback >
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  brightBackground: {
    backgroundColor: '#FFF',
  },
  dimBackground: {
    backgroundColor: '#F2F2F2',
  },
  tasksWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: "left",
    marginBottom: 10,
  },
  brightColor: {
    color: "#4A4A4A"
  },
  dimColor: {
    color: "#252525"
  },
  header: {
    flexDirection: 'row',
    paddingTop: 20
  },
  collapseList: {
    width: '100%'
  },
  empty: {
    fontSize: 16,
    color: '#888',
  },
  countWrapper: {
    width: 30,
    height: 30,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#888',
    borderWidth: 1
  },
  heading: {
    fontSize: 23,
    fontWeight: "500",
    paddingLeft: 5,
    marginBottom: 15,
  },
  addIcon: {
    marginLeft: 'auto'
  },
  taskList: {
    flexDirection: 'column-reverse'
  },
  OptionWrapper: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    // height: 60,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userInputWrapper: {
    flexDirection: 'column',
    position: 'absolute',
    bottom: 0,
  },
  writeTaskWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFD8AB',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#DCDBDB',
    borderWidth: 0,
    width: '80%',
    height: 40,
    marginLeft: 5,
    marginBottom: 6,
    marginTop: 6
  },
  addScheduledTaskWrapper: {
    width: 30,
    height: 30,
    backgroundColor: '#F6A02D',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#F6A02D',
    borderWidth: 1,
    shadowColor: '#F6A02D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  addWrapper: {
    width: 40,
    height: 40,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  whiteBgColor: {
    backgroundColor: '#FFF',
  },
  orangeBgColor: {
    backgroundColor: '#F6A02D',
  },
  HideOptions: {
    display: "none"
  },
  ShowOptions: {
    display: "flex"
  },
  datePicker: {
    width: "100%",
    zIndex: 999,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0
  },
  modalView: {
    width: '100%',
    height: 300,
    backgroundColor: "white",
    elevation: 5,
    position: 'absolute',
    bottom: 0,
  },
  datetimePickerWrapper: {
    padding: 35,
    alignItems: "center",
  },
  customTimeDisplayText: {
    alignItems: "flex-start",
  },
  setCustomScheduleWrapper: {
    padding: 20,
    flexDirection: 'row',
  },
  confirmScheduleButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    paddingRight: 7
  },
  actionIcon: {
    paddingLeft: 20,
    // backgroundColor: '#000'
  }
});

export default HomeScreen;
