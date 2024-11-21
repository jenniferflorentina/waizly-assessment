import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addTodo } from "../../redux/todo";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const AddTodo = () => {
  const dispatch = useDispatch();
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  const handleAddTaskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task.trim().length < 5) {
      setError("Minimum allowed task length is 5");
    } else if (task.trim().length > 50) {
      setError("Maximum allowed task length is 50");
    } else {
      dispatch(addTodo({ task, id: uuidv4(), completed: false }));
      setTask("");
    }
  };

  const handleUpdateTodoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
    if (task.trim().length > 5 && task.trim().length < 50) {
      setError("");
    }
  };

  return (
    <form onSubmit={handleAddTaskSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <TextField
          label="Add todo..."
          variant="outlined"
          value={task}
          onChange={handleUpdateTodoChange}
          error={Boolean(error)}
          helperText={error}
          fullWidth
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={error !== ""}
          sx={{ padding: '10px' }}
        >
          Add Todo
        </Button>
      </Box>
    </form>
  );
};

export default AddTodo;
