import React, { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

type FilterTodoProps = {
  getTodoFilterValue: (filterValue: string) => void;
};

const FilterTodo = ({ getTodoFilterValue }: FilterTodoProps) => {
  const [filterTodoVal, setFilterTodoVal] = useState("all");

  const handleFilterTodoChanges = (e: SelectChangeEvent<string>) => {
    setFilterTodoVal(e.target.value);
    getTodoFilterValue(e.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="filter-todo-label">Filter Todos</InputLabel>
      <Select
        labelId="filter-todo-label"
        value={filterTodoVal}
        onChange={handleFilterTodoChanges}
        label="Filter Todos"
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FilterTodo;
