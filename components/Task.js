import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import KeyboardListener from 'react-native-keyboard-listener';
import { Ionicons, MaterialCommunityIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';

const Task = (props) => {
    const [keyboardStatus, setKeyboardStatus] = useState("hide");

    return (
        <View style={styles.item}>
            <View style={[styles.itemLeft, props.status == "completed" ? styles.completed : null]}>
                <TouchableOpacity disabled={keyboardStatus == "show" ? true : false} key={props.index} onPress={props.onPressSquare}>
                   <View style={{paddingLeft: 12, paddingTop: 10, paddingBottom: 20}}>
                        {props.status != "completed" &&
                            <View style={styles.square}></View>
                        }
                        {props.status == "completed" &&
                            <Text style={styles.checksquare}><Ionicons name="checkbox" size={18} color="#D89335" /></Text>
                        }
                    </View>
                </TouchableOpacity>

                <View style={{ maxWidth: "89%", flexDirection: 'column', position: 'relative', paddingTop: 10, paddingBottom: 10}}>
                    <View style={{ flexDirection: 'row' }}>
                        {/* {props.status == "completed" &&
                            <View
                                style={styles.strike}
                            />
                        } */}
                        <Text style={[styles.itemText, props.status == "completed" ? styles.addStrike : null]}>
                            {props.text}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text><FontAwesome5 name="calendar-alt" size={14} color="#F6A02D" /></Text>
                        <Text style={{ color: "#F6A02D", paddingLeft: 4, fontWeight: '600' }}>{props.schedule}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity disabled={keyboardStatus == "show" ? true : false} key={props.index} onPress={props.onPressCircular}>
                <View style={{ paddingHorizontal: 18 }}>
                    {props.status == "completed" &&
                        <Text>
                            <AntDesign name="close" size={24} color={keyboardStatus == "hide" ? "#E0B387" : "#484B52"} />
                        </Text>
                    }
                </View>
            </TouchableOpacity>

            <KeyboardListener
                onWillShow={() => setKeyboardStatus("show")}
                onWillHide={() => setKeyboardStatus("hide")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#FDFAF7',
        //paddingBottom: 10,
        //paddingTop: 10,
        //paddingLeft: 12,
        //paddingRight: 18,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    itemLeft: {
        flexDirection: 'row',
        // alignItems: 'center',
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
        borderColor: '#D09950',
        opacity: 0.7
    },
    checksquare: {
        marginRight: 13,
        borderColor: '#4A4A4A',
        opacity: 0.5,
        position: 'relative'
    },
    itemText: {
        maxWidth: '100%',
        fontSize: 17,
        paddingEnd: 5,
        paddingBottom: 4,
        fontWeight: '500',
        color: '#444'
    },
    addStrike: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    },
    completed: {
        opacity: 0.3
    },
    strike: {
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        borderBottomColor: '#C8924A',
        borderBottomWidth: 1.3,
        top: 11,
        position: 'absolute'
    },
    circular: {
        width: 12,
        height: 12,
        opacity: 0.4,
        borderColor: '#4A4A4A',
        borderWidth: 1,
        borderRadius: 6,
    },
})

export default Task;
