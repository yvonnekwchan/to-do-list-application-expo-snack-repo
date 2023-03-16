import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const Subtask = (props) => {

    const inputRef = useRef(null);
    const [inputText, setInputText] = useState(props.text);
    const [modifiedInputText, setModifiedInputText] = useState(props.text);
    const [isInputFocused, setInputFocused] = useState(false);
    const [isCompleted, setIsCompleted] = useState(props.status == "completed" ? true : false);

    useEffect(() => {
        if (isCompleted == false) {
            isInputFocused ? inputRef.current.focus() : inputRef.current.blur();
        }
    }, [isInputFocused]);


    const handleInputFocus = () => setInputFocused(true);
    const handleInputBlur = () => setInputFocused(false);

    useEffect(() => {
        if (isInputFocused == false) {
            setInputText(props.text);
        }
    })

    const handleCompleteTask = () => {
        setIsCompleted(!isCompleted);
        props.updateSubtaskStatus(isCompleted, props.index);
    }

    const handleDeleteSubtask = () => {
        props.deleteSubtask(props.index);
    }

    const handleOnBlur = () => {
        //console.log("inputText onblur " + inputText);
        if (inputText == null || inputText.trim() === '') {
            props.removeInputField(props.index);
        } else {
            props.updateSubtaskItemsArray(inputText, props.index);
        }
        //props.setValue();
    }

    const handleSubmit = () => {
        if (props.index == props.numOfSubtasks - 1) {
            props.addSubtask();
        }
    }

    return (
        <View style={[styles.subtaskWrapper, isCompleted == true ? styles.completed : null]}>
            <TouchableOpacity onPress={() => handleCompleteTask()}>
                {isCompleted == false &&
                    <View style={styles.square}></View>
                }
                {isCompleted == true &&
                    <Text style={styles.checksquare}><Ionicons name="checkbox" size={18} color="#D89335" /></Text>
                }
            </TouchableOpacity>
            {isCompleted == true &&
                <View style={{width: '83%'}}>
                    <Text>{props.isOnEditPage == false ? inputText : props.text}</Text>
                    <View style={styles.halfLine}>
                    </View>
                </View>
            }
            {/* <Text>{props.value}</Text>
            <Text>default text: {props.text}; </Text>
            <Text>input text: {inputText}</Text>
            <Text>isInputFocused: {isInputFocused.toString()}</Text> */}
            {isCompleted != true &&
                <TextInput
                    style={styles.textInputWrapper}
                    ref={inputRef}
                    onFocus={handleInputFocus}
                    value={inputText}
                    placeholder={'Add a new subtask'}
                    autoFocus={props.text == null ? true : false}
                    returnKeyType='done'
                    onChangeText={text => { setModifiedInputText(text); setInputText(text); }}
                    onSubmitEditing={handleSubmit}
                    onBlur={() => { handleInputBlur(); handleOnBlur(); }}
                />
            }
            <TouchableOpacity onPress={() => handleDeleteSubtask()}>
                {isCompleted == true &&
                    <Text style={styles.delete}><Ionicons name="close" size={18} color="#D89335" /></Text>
                }
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    halfLine: {
        width: "95%",
        top: 0,
        height: "50%",
        borderBottomColor: "#D89335",
        borderBottomWidth: 1.3,
        position: "absolute",
        opacity: 0.5,
    },
    subtaskWrapper: {
        paddingBottom: 12,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 4,
        marginBottom: 4,
    },
    square: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: 15,
        borderWidth: 1,
        position: 'relative',
        borderColor: '#CCCBB7',
        opacity: 0.7
    },
    checksquare: {
        marginRight: 13,
        borderColor: '#4A4A4A',
        opacity: 0.5,
        position: 'relative'
    },
    delete: {
        textAlign: 'right'
    },
    completed: {
        opacity: 0.3
    },
    textInputWrapper: {
        width: "90%",
    }
})

export default Subtask;