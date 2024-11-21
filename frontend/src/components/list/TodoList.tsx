import React, { useState } from "react";
import { TodoInterface } from "../../App";
import { useDispatch } from "react-redux";
import { deleteTodo, toggleTodo, updateTodo } from "../../redux/todo"; // Assuming you have updateTodo action
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';

type TodoListProps = {
  todos: TodoInterface[];
  todoFilterValue: string;
  todoSearchValue: string;
};

const TodoList = ({
  todos,
  todoFilterValue,
  todoSearchValue,
}: TodoListProps) => {
  const dispatch = useDispatch();
  
  // State to manage editing
  const [editTodo, setEditTodo] = useState<TodoInterface | null>(null); // Track which todo is being edited
  const [editId, setEditId] = useState<string | null>(null); // Track which todo is being edited
  const [editText, setEditText] = useState<string>(''); // Track the new text for the todo

  // Handle toggling a todo completion status
  const handleToggleTodoChange = (todoId: string) => {
    dispatch(toggleTodo({ todoId }));
  };

  // Handle deleting a todo
  const handleDeleteTodoClick = (todoId: string) => {
    dispatch(deleteTodo({ todoId }));
  };

  // Handle editing a todo
  const handleEditClick = (todo: TodoInterface) => {
    setEditId(todo.id); // Set the todo as being edited
    setEditText(todo.task); // Set the text to be edited
    setEditTodo(todo);
  };

  // Handle saving the edited todo
  const handleSaveEdit = () => {
    if (editId && editText.trim()) {
      dispatch(updateTodo({ editedTodo: { ...editTodo, task: editText } }));
      setEditId(null); // Exit edit mode
      setEditText(''); // Clear the text
      setEditTodo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    }
  };

  return (
    <>
      {/* Material UI List */}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {todos
          .filter((todo) => {
            // Filter by the selected filter value (all/completed/incomplete)
            const matchesFilter = todoFilterValue === "all" || todo.completed === (todoFilterValue === "completed");
            // Filter by the search value
            const matchesSearch = todo.task.toLowerCase().includes(todoSearchValue.toLowerCase());
            return matchesFilter && matchesSearch;
          })
          .map((todo) => {
            return (
              <ListItem key={todo.id}>
                {editId === todo.id ? (
                  // When in edit mode, show a TextField for editing the task
                  <TextField
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e)} // Listen for Enter key
                    onBlur={handleSaveEdit} // Save on blur
                    autoFocus
                    size="small"
                    fullWidth
                  />
                ) : (
                  <>
                    <ListItemButton role={undefined} onClick={() => handleToggleTodoChange(todo.id)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={todo.completed}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={todo.task}
                        sx={{
                          textDecoration: todo.completed ? 'line-through' : 'none', // Apply stroke style when completed
                          color: todo.completed ? 'gray' : 'inherit', // Optional: Make completed text gray
                          transition: 'all 2s ease',
                        }}
                      />
                    </ListItemButton>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(todo)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodoClick(todo.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </ListItem>
            );
          })}
      </List>
    </>
  );
};

export default TodoList;
