import React, { useState } from 'react'
import Todo from './Todo';

export default function TodoList({ day }) {

    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const dayID = day.toLocaleDateString();

    const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("localTodoList" + dayID)) || []);

    const handleToggle = (todo) => {
        let mapped = tasks.map(task => {
            return task.id == todo.id ? { ...todo } : { ...task };
        });
        setTasks(mapped);
        
        localStorage.setItem(("localTodoList" + dayID), JSON.stringify(mapped));
    }

    const handleDelete = (todo) => {
        let updatedTasks = tasks.filter(task => task != todo);
        setTasks(updatedTasks);
        localStorage.setItem("localTodoList" + dayID, JSON.stringify(updatedTasks));
    }

    const addTask = (task) => {
        if (task != "") {
            const idCount = localStorage.getItem("idCount");
            const date = new Date();
            const id = date;
            const newTask = { id: id, title: task, completed: false };

            setTasks([...tasks, newTask]);
            localStorage.setItem("idCount", idCount + 1);
            localStorage.setItem("localTodoList" + dayID, JSON.stringify([...tasks, newTask]));
        }
    }


    const [userInput, setUserInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(userInput);
        setUserInput("");
    }

    const handleChange = (e) => {
        setUserInput(e.currentTarget.value);
    }


    return (
        <div>
            <div className={day.getDay() == new Date().getDay() ? 'todayText' : 'listDayText'}>{day.toLocaleString("en-US", dateOptions)}</div>
            <form onSubmit={handleSubmit}>
                <input className='todoInput' value={userInput} type="text" onChange={handleChange} placeholder="Enter task..." />
            </form>

            <div id="list">
                {tasks.map(todo => {
                    return (
                        <Todo todo={todo} handleToggle={handleToggle} handleDelete={handleDelete}></Todo>

                    )
                })}

            </div>

        </div>
    )
}



// rfc