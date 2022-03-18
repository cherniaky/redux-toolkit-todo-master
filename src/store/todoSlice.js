import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
    "todos/fetchTodos",
    async function (_, { rejectWithValue }) {
        try {
            let res = await fetch(
                "https://jsonplaceholder.typicode.com/todos?_limit=10"
            );
            if (!res.ok) {
                return rejectWithValue("not this");
            }
            const data = await res.json();

            return data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.massage);
        }
    }
);

export const deleteTodo = createAsyncThunk(
    "todos/deleteTodo",
    async function (id, { rejectWithValue, dispatch }) {
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/todos/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Can't delete task. Server error.");
            }

            dispatch(removeTodo({ id }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const toggleStatus = createAsyncThunk(
    "todos/toggleStatus",
    async function (id, { rejectWithValue, dispatch, getState }) {
        const todo = getState().todos.todos.find((todo) => todo.id == id);
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/todos/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        completed: !todo.completed,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Can't delete task. Server error.");
            }

            dispatch(toggleComplete({ id }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const addNewTodo = createAsyncThunk(
    "todos/addNewTodo",
    async function (text, { rejectWithValue, dispatch, getState }) {
        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/todos/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: new Date().toISOString(),
                        title: text,
                        completed: false,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Can't delete task. Server error.");
            }

            dispatch(addTodo({ title: text }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const todoSlice = createSlice({
    name: "todos",
    initialState: {
        todos: [],
        status: null,
        error: null,
    },
    reducers: {
        addTodo(state, action) {
            state.todos.push({
                id: new Date().toISOString(),
                title: action.payload.title,
                completed: false,
            });
        },
        toggleComplete(state, action) {
            const toggledTodo = state.todos.find(
                (todo) => todo.id === action.payload.id
            );
            toggledTodo.completed = !toggledTodo.completed;
        },
        removeTodo(state, action) {
            state.todos = state.todos.filter(
                (todo) => todo.id !== action.payload.id
            );
        },
    },
    extraReducers: {
        [fetchTodos.pending]: (state, action) => {
            state.status = "loading";
            state.error = null;
        },
        [fetchTodos.fulfilled]: (state, action) => {
            state.status = "resolved";
            state.todos = action.payload;
        },
        [fetchTodos.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
        [deleteTodo.rejected]: (state, action) => {
            state.status = "rejected";
            state.error = action.payload;
        },
    },
});

export const { addTodo, toggleComplete, removeTodo } = todoSlice.actions;

export default todoSlice.reducer;
