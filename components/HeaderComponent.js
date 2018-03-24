import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Image, Alert } from 'react-native';

import { deleteAllTodoLists } from "../databases/allSchemas";

import { SORT_DESCEDING, SORT_ASCEDING } from "../values/sortStates";

const HeaderComponent = props => {
    const { title, showAddTodoList, hasAddButton, hasSortButton, sort, sortState, hasDeleteAllButoon } = props;
    let sortIcon = sortState === SORT_ASCEDING ? 
        require('../images/sort-asc-icon.png') :
        require('../images/sort-desc-icon.png');

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>
                {title}
            </Text>
            {hasAddButton && <TouchableOpacity style={styles.addButton} onPress={showAddTodoList}>
                <Image style={styles.addButtonImage} source={require('../images/add-icon.png')} />
            </TouchableOpacity>}

            {hasSortButton && <TouchableOpacity style={styles.addButton} onPress={sort}>
                <Image style={styles.sortButtonImage} source={sortIcon} />
            </TouchableOpacity>}

            {hasDeleteAllButoon && <TouchableOpacity style={styles.addButton} onPress={
                () => {
                    Alert.alert(
                        'Delete All',
                        'Are you sure want to delete all TodoList ?',
                        [
                            {
                                text: 'No',
                                onPress: () => { },
                                style: 'cancel'
                            },
                            {
                                text: 'Yes',
                                onPress: () => {
                                    deleteAllTodoLists().then().catch((error) => {
                                        alert(`Delete all todoList Failed. error = ${error}`);
                                    });
                                }
                            }
                        ],
                        { cancelable: true }
                    );
                }
            }>
                <Image style={styles.deleteButtonImage} source={require('../images/delete-icon.png')} />
            </TouchableOpacity>}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgb(224, 93, 144)',
        height: Platform.OS === 'ios' ? 100 : 80
    },
    titleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        position: 'absolute',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: 50
    },
    addButton: {
        zIndex: 2,
        marginRight: 10,
        marginTop: 30,
    },
    addButtonImage: {
        width: 42,
        height: 42,
        tintColor: '#fff'
    },
    deleteButtonImage: {
        width: 26,
        height: 26,
        tintColor: '#fff'
    }, 
    sortButtonImage: {
        width: 26,
        height: 26,
        tintColor: '#fff'
    }
});

export default HeaderComponent;