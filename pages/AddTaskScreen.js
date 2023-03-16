// React Native Bottom Navigation
// https://aboutreact.com/react-native-bottom-navigation/

import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Modal, Portal, Provider, Button } from 'react-native-paper';
import Subtask from '../components/Subtask';

const AddTaskScreen = ({ route, navigation }) => {
  const [forceUpdate, setForceUpdate] = useState(0);

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [subtaskItems, setSubtaskItems] = useState([]);
  const [subtaskItemsStatus, setSubtaskItemsStatus] = useState([]);
  const [addTaskShowUp, setAddTaskShowUp] = useState(true);
  const [note, setNote] = useState();


  const addSubtask = () => {
    setSubtaskItems([...subtaskItems, null]);
    setSubtaskItemsStatus([...subtaskItemsStatus, "pending"]);
    setAddTaskShowUp(false);
  };


  const updateSubtaskItemsArray = (input, index) => {
    let subtaskItemsCopy = [...subtaskItems];
    subtaskItemsCopy[index] = input;
    setSubtaskItems(subtaskItemsCopy);
    setAddTaskShowUp(true);
  }

  useEffect(() => {
    console.log("subtaskItems array " + subtaskItems);
  }, [subtaskItems])


  const updateSubtaskStatus = (isCompleted, index) => {
    let subtaskItemsStatusCopy = [...subtaskItemsStatus];
    if (isCompleted == true) {
      subtaskItemsStatusCopy[index] = "pending";
    } else {
      subtaskItemsStatusCopy[index] = "completed";
    }
    setSubtaskItemsStatus(subtaskItemsStatusCopy);
  }

  useEffect(() => {
    //console.log("test " + subtaskItemsStatus);
  }, [subtaskItemsStatus])


  const removeInputField = (index) => {
    let subtaskItemsCopy = [...subtaskItems];
    subtaskItemsCopy.splice(index, 1);
    setSubtaskItems(subtaskItemsCopy);

    let subtaskItemsStatusCopy = [...subtaskItemsStatus];
    subtaskItemsStatusCopy.splice(index, 1);
    setSubtaskItemsStatus(subtaskItemsStatusCopy);

    setAddTaskShowUp(true);
  }

  const [task, setTask] = useState();

  const handleAddTask = () => {
    if (task != "" && task != null) {
      if (route.params.pageToNavigate == "TODAY") {
        var newTasks = [];
        if (route.params.taskItems != null && route.params.taskItems.length != 0) {
          newTasks = [
            {
              id: route.params.taskItems.length + 1,
              taskName: task,
              status: "pending",
              schedule: route.params.schedule,
              subtasks: {
                subtaskItems: subtaskItems,
                subtaskItemsStatus: subtaskItemsStatus
              },
              note: note
            },
            ...route.params.taskItems
          ];
        } else {
          newTasks = [
            {
              id: 1,
              taskName: task,
              status: "pending",
              schedule: route.params.schedule,
              subtasks: {
                subtaskItems: subtaskItems,
                subtaskItemsStatus: subtaskItemsStatus
              },
              note: note
            }
          ];
        }
        route.params.setTaskItems(newTasks);
      }

      if (route.params.pageToNavigate == "TOMORROW") {
        if (route.params.taskItems != null && route.params.taskItems.length != 0) {
          newTasks = [
            {
              id: route.params.taskItems.length + 1,
              taskName: task,
              status: "pending",
              schedule: route.params.schedule,
              subtasks: {
                subtaskItems: subtaskItems,
                subtaskItemsStatus: subtaskItemsStatus
              },
              note: note
            },
            ...route.params.taskItems,
          ];
        } else {
          newTasks = [
            {
              id: 1,
              taskName: task,
              status: "pending",
              schedule: route.params.schedule,
              subtasks: {
                subtaskItems: subtaskItems,
                subtaskItemsStatus: subtaskItemsStatus
              },
              note: note
            }
          ];
        }
        route.params.setTaskItems(newTasks);
      }

      if (route.params.pageToNavigate == "UPCOMING") {
        if (route.params.taskItems != null && route.params.taskItems.length != 0) {
          newTasks = [
            {
              id: route.params.taskItems.length + 1,
              taskName: task,
              status: "pending",
              schedule: route.params.schedule,
              subtasks: {
                subtaskItems: subtaskItems,
                subtaskItemsStatus: subtaskItemsStatus
              },
              note: note
            },
            ...route.params.taskItems,
          ];
        } else {
          newTasks = [
            {
              id: 1,
              taskName: task,
              status: "pending",
              schedule: route.params.schedule,
              subtasks: {
                subtaskItems: subtaskItems,
                subtaskItemsStatus: subtaskItemsStatus
              },
              note: note
            }
          ];
        }
        route.params.setTaskItems(newTasks);
      }

      setTask(null);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.Heading}>Add new task</Text>

        <View style={{ paddingBottom: 25 }}>
          <Text style={styles.subHeading}>Task Name</Text>
          <TextInput style={styles.input} placeholder={'Example: Wake up'} value={task} onChangeText={text => setTask(text)} />
        </View>

        <View style={{ paddingBottom: 25 }}>
          <Text style={styles.subHeading}>Subtasks</Text>
          {
            subtaskItems.map((item, index) => {
              return (
                <Subtask text={item} key={index} index={index} isOnEditPage={false} status={"pending"}
                  forceUpdateCount={forceUpdate} forceUpdate={() => { setForceUpdate(forceUpdate => forceUpdate + 1); }}
                  numOfSubtasks={subtaskItems.length} updateSubtaskItemsArray={updateSubtaskItemsArray} addSubtask={addSubtask}
                  removeInputField={removeInputField} updateSubtaskStatus={updateSubtaskStatus}
                />
              )
            })
          }
          {addTaskShowUp == true &&
            <TouchableOpacity onPress={addSubtask}>
              <Text style={styles.addSubtask}>+   New Subtask</Text>
            </TouchableOpacity>
          }
        </View>

        <View style={{ paddingBottom: 25 }}>
          <Text style={styles.subHeading}>Notes</Text>
          {note != "" && note != null &&
            <TouchableOpacity onPress={showModal}><Text>{note}</Text></TouchableOpacity>
          }
          {note == "" || note == null &&
            <TouchableOpacity style={styles.notesWrapper} onPress={showModal}><Text style={styles.placeholder}>Tap to add notes</Text></TouchableOpacity>
          }
        </View>

        <View style={styles.fixToText}>
          <TouchableOpacity onPress={() => { handleAddTask(); navigation.navigate('Home') }}
            style={[styles.actionButton, { backgroundColor: '#F6A02D' }]}>
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Home')}
            style={[styles.actionButton, { backgroundColor: '#FFECD9' }]}>
            <Text style={[styles.actionText, { color: '#F6A02D' }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <Provider>
          <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
              <TextInput placeholder={'Write a note...'} multiline={true} autoFocus={true} value={note} onChangeText={text => setNote(text)} />
            </Modal>
          </Portal>
        </Provider>
      </View>
    </TouchableWithoutFeedback >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 20,
    backgroundColor: "#FFF"
  },
  Heading: {
    paddingTop: 25,
    paddingBottom: 30,
    fontSize: 22,
    fontWeight: "600"
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    backgroundColor: '#FFF',
    borderRadius: 10,
    // borderColor: '#DCDBDB',
    // borderWidth: 1,
    shadowColor: '#DCDBDB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    width: "100%",
    height: 40,
  },
  notesWrapper: {
    width: "100%",
    height: 40,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: "#CCCBB7",
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  placeholder: {
    color: "#777",
    fontWeight: "500"
  },
  addSubtask: {
    fontSize: 15,
    color: "#444"
  },
  subtaskWrapper: {
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 15,
    marginTop: 4,
    borderWidth: 1,
    position: 'relative',
    borderColor: '#CCCBB7',
    opacity: 0.7
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    width: "48%"
  },
  actionText: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  modalContainer: {
    backgroundColor: 'white',
    width: "90%",
    height: "35%",
    paddingLeft: 18,
    paddingRight: 18,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 250,
    borderRadius: 10,
    paddingTop: 10,
    justifyContent: "flex-start"
  }
});
export default AddTaskScreen;
