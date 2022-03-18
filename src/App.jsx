import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addNewTodo, fetchTodos } from "./store/todoSlice";
import NewTodoForm from "./components/NewTodoForm";
import TodoList from "./components/TodoList";

import "./App.css";

function App() {
    const [title, setText] = useState("");
    const { error, status } = useSelector((state) => state.todos);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTodos());

        return () => {};
    }, []);

    const handleAction = () => {
        if (title.trim().length) {
            dispatch(addNewTodo(title));
            setText("");
        }
    };

    return (
        <div className="App">
            {status == "rejected" ? <>{error}</> : <></>}
            <NewTodoForm
                value={title}
                updateText={setText}
                handleAction={handleAction}
            />
            {status == "loading" ? <>Loading...</> : <TodoList />}
        </div>
    );
}

export default App;
