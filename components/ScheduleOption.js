import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons, EvilIcons, SimpleLineIcons } from '@expo/vector-icons';

const ScheduleOption = (props) => {
    return (
        <View style={[styles.scheduleTaskWrapper, props.selection == props.value || props.isSelected == true? styles.orangeBgColor : styles.whiteBgColor]}>
            <Text><EvilIcons name="bell" size={24} color={props.selection == props.value ? "#FFF" : "#F6A02D"} /></Text>
            <Text style={[{ fontSize: 16 }, props.selection == props.value ? styles.whiteText : styles.blackText]}>{props.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    scheduleTaskWrapper: {
        height: 32,
        borderRadius: 60,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 12,
        marginRight: 5,
        borderWidth: 1
    },
    whiteBgColor: {
        borderColor: "#FED3A3",
        backgroundColor: '#FFF',
    },
    orangeBgColor: {
        borderColor: "#F6A02D",
        backgroundColor: '#F6A02D',
    },
    blackText: {
         color: '#F6A02D',
        // color: '#9598A1',
    },
    whiteText: {
        color: '#FFF'
    }
})

export default ScheduleOption;