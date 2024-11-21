import {createSlice} from "@reduxjs/toolkit";
import {TodoInterface} from "../App";

interface TodosListInterface {
    todos: TodoInterface[]
}

const initialState: TodosListInterface = {
    todos: []
}

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, {payload: {task, id, completed}})=>{
             
            state.todos.push({id, task, completed})
        },
        deleteTodo: (state, {payload: {todoId}})=>{
            state.todos = state.todos.filter(todo=> todo.id !== todoId)
        },
        updateTodo: (state, {payload: {editedTodo}})=>{
            console.log(editedTodo)
            state.todos = state.todos.map(todo => todo.id === editedTodo.id ? editedTodo : todo);
        },
        toggleTodo: (state, {payload: {todoId}})=>{
            state.todos = state.todos.map(todo => todo.id === todoId ? {...todo, completed: !todo.completed} : todo);
        },
    }
})
export const {addTodo, deleteTodo, updateTodo, toggleTodo} = todoSlice.actions;
export default todoSlice.reducer;