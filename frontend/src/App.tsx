import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import AddTodo from "./components/add/AddTodo";
import FilterTodo from "./components/filter/FilterTodo";
import TodoList from "./components/list/TodoList";
import { Box, Container, Stack, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export interface TodoInterface {
  id: string;
  task: string;
  completed: boolean;
}

const App = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [todoFilterValue, setTodoFilterValue] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");

  const getTodoFilterValue = (filterValue: string) =>
    setTodoFilterValue(filterValue);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Clock setup using WorldTimeAPI
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_TIME_API_URL ?? ''); // Example UTC timezone
        const data = await response.json();
        const currentDateTime = new Date(data.datetime);
        const hours = String(currentDateTime.getHours()).padStart(2, "0");
        const minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
        const seconds = String(currentDateTime.getSeconds()).padStart(2, "0");
        setCurrentTime(`${hours}:${minutes}:${seconds}`);
      } catch (error) {
        console.error("Error fetching time data:", error);
      }
    };

    fetchTime();
    const clockInterval = setInterval(fetchTime, 1000);

    return () => clearInterval(clockInterval); // Cleanup interval on unmount
  }, []);

  return (
    <main>
      <Container maxWidth="sm">
        {/* Updated Header Section with Typography and Styling */}
        <Box sx={{ textAlign: 'center', margin: 4 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main', 
              letterSpacing: 2, 
              fontSize: '2.5rem' 
            }}
          >
            Todo App
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Your task manager to stay organized
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Current Time: {currentTime}
          </Typography>
        </Box>

        {/* Filter, Search Bar, and Todo Input Section */}
        <Stack spacing={2} marginBottom={4}>
          <Box display="flex" gap={2} mb={2}>
            {/* Search Bar - 70% */}
            <Box sx={{ flex: 7 }}>
              <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Filter Dropdown - 30% */}
            <Box sx={{ flex: 3 }}>
              <FilterTodo getTodoFilterValue={getTodoFilterValue} />
            </Box>
          </Box>

          <Box>
            <AddTodo />
          </Box>
        </Stack>

        {/* Todo List Section */}
        <TodoList todos={todos} todoFilterValue={todoFilterValue} todoSearchValue={searchText} />
      </Container>
    </main>
  );
};

export default App;
