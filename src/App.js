import React, { useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './App.css';
import TodoList from './components/TodoList';

const fontTheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'BlinkMacSystemFont',
    }
  }
});

const smallFontTheme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'BlinkMacSystemFont',
      fontSize: 15,
    }
  }
});


function App() {

  localStorage.setItem("idCount", 1);

  const [emoji, setEmoji] = useState('');
  const [text, setText] = useState("");

  const handleEmojiChange = (event) => {
    setEmoji(event.target.value);
  }

  const handleTextChange = (event) => {
    setText(event.target.value);
  }

  const [popover, setPopover] = useState(null);
  const [popX, setPopX] = useState(0);
  const [popY, setPopY] = useState(0);
  const [popText, setPopText] = useState("");

  const handlePopoverOpen = (event, dayText) => {
    const popoverRoot = popover ? popover.children[1] : null;

    // only open popover if user is hovering over a new element 
    if (!event.currentTarget.children[1].isEqualNode(popoverRoot)) {
      setPopX(event.pageX);
      setPopY(event.pageY);
      setPopText(dayText);
      setPopover(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setPopover(null);
  }

  const open = Boolean(popover);

  const [day, setDay] = useState(null);
  const [specialDayArray, setSpecialDayArray] = useState(JSON.parse(localStorage.getItem("specialDayArray")) || []);

  const handleSubmit = (event) => {
    // prevents page from refreshing after submit
    event.preventDefault();

    const specialDay = { emoji: emoji, day: day, text: text };
    specialDayArray.push(specialDay);
    setSpecialDayArray(specialDayArray);
    localStorage.setItem("specialDayArray", JSON.stringify(specialDayArray));

    setEmoji('');
    setDay(null);
    setText("");
  }

  const deleteIcon = (day) => {
    const dayToDelete = specialDayArray.find((element) => new Date(element.day).toLocaleDateString() == new Date(day).toLocaleDateString());
    let updated = specialDayArray.filter((day => day != dayToDelete));
    setSpecialDayArray(updated);
    localStorage.setItem("specialDayArray", JSON.stringify(updated));
    setPopover(null);
  }


  // remove todo-list items from local storage once day is passed by 2 days
  useEffect(() => {
    const today = new Date();
    const pastDay = new Date(today.getDate() - 2).toLocaleDateString();
    
    localStorage.removeItem("localTodoList" + pastDay);
    console.log(localStorage);
  });
  

  // week is an array of date objects  
  var week = [];

  for (let i = -1; i < 7; i++) {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + i);
    week.push(newDate);
  }

  function ServerDay(props) {
    // props are the props of PickersDay the default for the "day" prop

    // assigning values from props object
    const { specialDayArray = [], day, outsideCurrentMonth, ...other } = props;
    const potentialDay = specialDayArray.find((element) => (new Date(element.day).getDate() == props.day.date() &&
      new Date(element.day).getMonth() == props.day.month()));


    const isSelected =
      (potentialDay != undefined)
      && !props.outsideCurrentMonth
      && (new Date(potentialDay.day).getMonth() == props.day.month());

    return (
      <div>
        <Badge
          overlap='circular'
          labelId={props.day}
          onClick={() => deleteIcon(props.day)}
          badgeContent={isSelected ? potentialDay.emoji : undefined}
          onMouseEnter={isSelected ? (e) => handlePopoverOpen(e, potentialDay.text) : null}
          onMouseLeave={isSelected ? handlePopoverClose : null}
        >
          <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
      </div>
    );
  }




  return (
    <div className="App">
      <ThemeProvider theme={fontTheme}>

        <div className='Header'>
          <h2 style={{ backgroundColor: 'mistyrose', width: '100%' }}>My Daily Planner 🍓</h2>
        </div>

        <div style={{ display: 'flex' }}>
          <div className='DateLeft'>

            <div className='DateCal'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  views={['day', 'month']}
                  sx={{
                    marginLeft: 2,
                    marginTop: 0,
                  }}
                  onMouseLeave={handlePopoverClose}
                  slots={{
                    day: ServerDay
                  }}
                  slotProps={{
                    day: {
                      specialDayArray,
                    }
                  }}

                />
              </LocalizationProvider>
              <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: 'none',
                  borderRadius: 0,
                }}
                open={open}
                anchorReference="anchorPosition"
                anchorPosition={{ top: popY, left: popX }}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <div className='PopoverText'>
                  <Typography
                    sx={{
                      paddingTop: 0.2,
                      paddingLeft: 0.5,
                      paddingRight: 0.5,
                      paddingBottom: 0.2,
                      fontSize: 14,
                    }}
                  >
                    {popText}
                  </Typography> 
                </div>
              </Popover>
            </div>

            <div className='EventSelector'>
              <Box sx={{ width: 270 }}>
                <form onSubmit={handleSubmit} >
                  <ThemeProvider theme={smallFontTheme}>
                    <FormControl required fullWidth sx={{
                      marginRight: 2,
                      marginBottom: 2,
                      '.MuiFormLabel-root.MuiInputLabel-root.Mui-focused': {
                        color: 'grey'
                      }
                    }}>

                      <InputLabel
                        size='small'
                        sx={{ fontSize: 15 }}>Icon</InputLabel>
                      <Select
                        size='small'
                        labelId='emoji-select'
                        value={emoji}
                        label="emoji"
                        onChange={handleEmojiChange}
                        sx={{
                          '.MuiOutlinedInput-notchedOutline': {
                            border: '2px solid pink',

                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'pink',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'pink'
                          }
                        }}
                      >
                        <MenuItem value={'🎀'} sx={{ textAlign: 'center' }}>🎀</MenuItem>
                        <MenuItem value={'🧸'}>🧸</MenuItem>
                        <MenuItem value={'💌'}>💌</MenuItem>
                        <MenuItem value={'🍀'}>🍀</MenuItem>
                        <MenuItem value={'⭐'}>⭐</MenuItem>
                        <MenuItem value={'🫐'}>🫐</MenuItem>
                      </Select>
                    </FormControl>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
                        value={day}
                        onChange={(newValue) => setDay(newValue)}
                        slotProps={{
                          layout: {
                            sx: {
                              '.MuiPickersDay-root': {
                                fontSize: '12px'
                              },
                              '.MuiPickersDay-root:not': {

                              },
                            }
                          },
                          textField: {
                            required: true,
                          }
                        }}
                        sx={{
                          marginBottom: 2,
                          width: 270,
                          '.MuiOutlinedInput-notchedOutline': {
                            border: '2px solid pink',

                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'pink',
                            },
                            '&:hover fieldset': {
                              borderColor: 'pink',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'pink',
                            },
                          },
                        }} />
                    </LocalizationProvider>

                    <TextField fullWidth className='DayTextField' id="outlined-basic"
                      label="Description"
                      onMouseEnter={handlePopoverClose}
                      sx={{
                        marginBottom: 2,
                        '.MuiOutlinedInput-notchedOutline': {
                          border: '2px solid pink',

                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'pink',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'pink'
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'pink',
                          },
                          '&:hover fieldset': {
                            borderColor: 'pink',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'pink',
                          },
                        }

                      }}
                      value={text}
                      onChange={handleTextChange}
                      variant="outlined" />

                    <button className='submitTodo' type='submit' >Add</button>
                  </ThemeProvider>
                </form>
              </Box>
            </div>
          </div>


          <div className='WeeklySpread' >
            {week.map(day => {
              return (
                <div className='DayList'>
                  <TodoList day={day}></TodoList>
                </div>
              )
            })}
          </div>

        </div>
      </ThemeProvider>
    </div>

  );
}

export default App;
