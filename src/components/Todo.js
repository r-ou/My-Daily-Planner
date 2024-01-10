import React from 'react'
import Checkbox from '@mui/material/Checkbox';
import { pink } from '@mui/material/colors';


export default function Todo({ todo, handleToggle, handleDelete }) {
    const handleClick = (event) => {
        todo.completed = event.target.checked;
        handleToggle(todo);
        // reset the to do list to be a new list with the one item marked as completed
    }

    const handleDeleteClick = (event) => {
        handleDelete(todo);
    }

    return (
        <div style={{display: 'flex'}}>
              <Checkbox
                size='small'
                
                defaultChecked={todo.completed}
                onChange={(event) => {
                    handleClick(event);
                }}
                sx={{
                    paddingLeft: "0px",
                    '&.Mui-checked': {
                        color: pink[200]
                    },
                    '&:hover': { bgcolor: 'transparent' },
                    '.MuiTouchRipple-root': {
                        width: '20px',
                    }
                }}
            />
            <div id={todo.id} name="todo" value={todo.id} onClick={handleDeleteClick}
            style={{
                cursor: 'pointer',
                marginTop: "9px"
            }}
            className={todo.completed ? "strike" : "todo"} >
          
            {todo.title}
            </div>

        </div>
        
    )
}