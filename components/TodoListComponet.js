import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Alert, Text, TextInput } from 'react-native';
import { updateTodoList, deleteTodoList, queryAllTodoLists, filterTodoList , insertTodos2TodoList, getTodosFromTodoListId} from "../databases/allSchemas";
import realm from "../databases/allSchemas";
import Swipeout from "react-native-swipeout";

import HeaderComponent from "./HeaderComponent";
import PopupDialogComponent from "./PopupDialogComponent";

import { SORT_DESCEDING, SORT_ASCEDING } from "../values/sortStates";

let FlatListItem = props => {
    const { itemIndex, id, name, creationDate, popupDialogComponent, onPressItem } = props;
    showEditModal = () => {
        popupDialogComponent.showDialogComponentForUpdate({
            id, name
        });
    }
    ShowDeleteConfirmation = () => {
        Alert.alert(
            'Delete',
            'Delete a todoList',
            [
                {
                    text: 'No',
                    onPress: () => { },
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        deleteTodoList(id).then().catch((error) => {
                            alert(`Failed to delete todoList width id = ${id} , error = ${error}`);
                        });
                    }
                }
            ],
            { cancelable: true }
        );
    }
    return (
        <Swipeout
            right={[
                {
                    text: 'Edit',
                    backgroundColor: 'rgb(81,134,237)',
                    onPress: showEditModal
                },
                {
                    text: 'Delete',
                    backgroundColor: 'rgb(217,80,64)',
                    onPress: ShowDeleteConfirmation
                }
            ]}
            autoClose={true}
        >
            <TouchableOpacity onPress={onPressItem}>
                <View style={{ backgroundColor: itemIndex % 2 == 0 ? 'powderblue' : 'skyblue' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, margin: 10 }}>{name}</Text>
                    <Text style={{ fontSize: 18, margin: 10 }} numberOfLines={2}>{creationDate.toLocaleString()}</Text>
                </View>
            </TouchableOpacity>

        </Swipeout>
    );
}

class TodoListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortState: SORT_ASCEDING,
            todoList: [],
            searchedName: ''
        };
        this.reloadData();
        realm.addListener('change', () => {
            this.reloadData();
        })
    }
    sort = () => {
        this.setState({
            sortState: this.state.sortState === SORT_ASCEDING ? SORT_DESCEDING : SORT_ASCEDING,
            todoList: this.state.todoList.sorted("name", this.state.sortState === SORT_ASCEDING ? true : false)
        });
    }

    reloadData = () => {
        queryAllTodoLists().then((todoList) => {
            this.setState({ todoList })
        }).catch((error) => {
            this.setState({ todoList: [] })
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <HeaderComponent
                    title={"Todo List"}
                    showAddTodoList={
                        () => {
                            this.refs.popupDialogComponent.showDialogComponentForAdd();
                        }
                    }
                    hasAddButton={true}
                    hasDeleteAllButoon={true}
                    hasSortButton={true}
                    sort={this.sort}
                    sortState={this.state.sortState}
                />
                <TextInput
                    placeholder={'Enter text to Search'}
                    autoCorrect={false}
                    underlineColorAndroid={'white'}
                    style={styles.textInput}
                    onChangeText={(txt)=>{
                        this.setState({ searchedName : txt });
                        filterTodoList(txt).then(filterTodoList => {
                            this.setState({todoList:filterTodoList });
                        }).catch((error) => {
                            this.setState({todoList:[] });
                        });
                    }}
                />
                <FlatList
                    style={styles.flatList}
                    data={this.state.todoList}
                    renderItem={({ item, index }) => <FlatListItem
                        {...item}
                        itemIndex={index}
                        popupDialogComponent={this.refs.popupDialogComponent}
                        onPressItem={() => {
                            // insertTodos2TodoList(item.id,[
                            //     {
                            //         id: 1,
                            //         name: 'Make Angular',
                            //         done: false
                            //     },
                            //     {
                            //         id: 2,
                            //         name: 'Make React Native',
                            //         done: true
                            //     },
                            //     {
                            //         id: 3,
                            //         name: 'Make React',
                            //         done: false
                            //     },
                            // ]). then((insertedTodos) => {
                            //     alert(`Added faked Todos: ${JSON.stringify(insertedTodos)}`);
                            // }).catch((error) => {
                            //     alert(`Cannot add fake Todos. Error : ${error}`);
                            // });
                            getTodosFromTodoListId(item.id).then(insertedTodos => {
                                alert(`Faked Todos : ${JSON.stringify(insertedTodos)}`);
                            }).catch((error) => {
                                alert(`Cannot find fake Todos. Error : ${JSON.stringify(error)}`);
                            })
                        }}
                    />}
                    keyExtractor={item => item.id}
                />
                <PopupDialogComponent ref={"popupDialogComponent"} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    flatList: {
        flex: 1,
        flexDirection: 'column',
    },
    textInput: {
        height:40,
        backgroundColor:'#fff',
        padding:5
    }
});
export default TodoListComponent;
