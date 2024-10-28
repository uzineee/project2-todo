import React, {useCallback, useRef, useReducer, useMemo, createContext} from "react";
import './App.css';
import Header from './component/Header';
import TodoEditor from "./component/TodoEditor";
import TodoList from "./component/TodoList";
// import TestComp from "./component/TestComp";

export const TodoStateContext  = React.createContext();
export const TodoDispatchContext = React.createContext();

const mockTodo = [
    {
        id: 0,
        isDone: false,
        content: "React 공부하기",
        createdDate: new Date().getTime(),
    },
    {
        id: 1,
        isDone: false,
        content: "빨래 널기",
        createdDate: new Date().getTime(),
    },
    {
        id: 2,
        isDone: false,
        content: "노래 연습하기",
        createdDate: new Date().getTime(),
    },
]

function reducer(state, action) {
    switch (action.type) {
        case "CREATE":{
            return [action.newItem, ...state];
        }
        case "UPDATE": {
            return state.map((it)=>
                it.id === action.targetId ? {...it, isDone: !it.isDone} : it
            )
        }
        case "DELETE": {
            return state.filter((it)=> it.id!== action.targetId);
        }
        default:
            return state;
    }

}



function App() {
    const idRef = useRef(3);
    //const [todo  , setTodo] = useState(mockTodo);
    const [todo  , dispatch] = useReducer(reducer, mockTodo);


/*
 // useState 이용
    const onCreate = (content) => {
        const newItem = {
            id: idRef.current,
            content,
            isDone: false,
            createdDate: new Date().getTime(),
        };
        setTodo([newItem, ...todo]);
        idRef.current += 1;
    }

    const onUpdate = (targetId) => {
        setTodo(
            todo.map((it)=>
                it.id === targetId ? {...it, isDone: !it.isDone} : it
            )
        );
    };

    const onDelete = (targetId) => {
        setTodo(todo.filter((it)=> it.id!== targetId));
    }

 */

    const onCreate = (content) => {
        dispatch({
            type: 'CREATE',
            newItem: {
                id: idRef.current,
                content,
                isDone: false,
                createdDate: new Date().getTime(),
            },
        });
        idRef.current += 1;
    }

    const onUpdate = useCallback((targetId) => {
        dispatch({
            type: 'UPDATE',
            targetId,
        });
    }, []);

    const onDelete = useCallback((targetId) => {
        dispatch({
            type: 'DELETE',
            targetId,
        });
    }, []);

    const memoizedDispatch = useMemo(() => {
        return { onCreate, onUpdate, onDelete };
    }, []);

    return (
    <div className="App">
       {/* <TestComp />*/}
        <Header />
        <TodoStateContext.Provider value={todo}>
            <TodoDispatchContext.Provider value={memoizedDispatch}>
                <TodoEditor />
                <TodoList />
            </TodoDispatchContext.Provider>
        </TodoStateContext.Provider>

    </div>
  );
}

export default App;
