import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  columns: [
    { id: 'todo', title: 'To Do', taskIds: [] },
    { id: 'in-progress', title: 'In Progress', taskIds: [] },
    { id: 'done', title: 'Done', taskIds: [] }
  ],
  tasks: {},
  loading: false,
  error: null
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    fetchBoardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBoardSuccess: (state, action) => {
      state.columns = action.payload.columns;
      state.tasks = action.payload.tasks;
      state.loading = false;
    },
    fetchBoardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTask: (state, action) => {
      const { task, columnId } = action.payload;
      state.tasks[task.id] = task;
      const column = state.columns.find(col => col.id === columnId);
      if (column) {
        column.taskIds.push(task.id);
      }
    },
    updateTask: (state, action) => {
      const task = action.payload;
      state.tasks[task.id] = { ...state.tasks[task.id], ...task };
    },
    deleteTask: (state, action) => {
      const taskId = action.payload;
      // Remove task from columns
      state.columns.forEach(column => {
        column.taskIds = column.taskIds.filter(id => id !== taskId);
      });
      // Delete task
      delete state.tasks[taskId];
    },
    moveTask: (state, action) => {
      const { taskId, source, destination } = action.payload;
      
      if (!destination || (source.columnId === destination.columnId && source.index === destination.index)) {
        return;
      }
      
      // Remove from source column
      const sourceColumn = state.columns.find(col => col.id === source.columnId);
      if (sourceColumn) {
        sourceColumn.taskIds.splice(source.index, 1);
      }
      
      // Add to destination column
      const destinationColumn = state.columns.find(col => col.id === destination.columnId);
      if (destinationColumn) {
        destinationColumn.taskIds.splice(destination.index, 0, taskId);
      }
      
      // Update task status
      if (state.tasks[taskId]) {
        state.tasks[taskId].status = destination.columnId;
      }
    },
    addColumn: (state, action) => {
      state.columns.push({
        id: action.payload.id,
        title: action.payload.title,
        taskIds: []
      });
    },
    updateColumn: (state, action) => {
      const { id, title } = action.payload;
      const column = state.columns.find(col => col.id === id);
      if (column) {
        column.title = title;
      }
    },
    deleteColumn: (state, action) => {
      const columnId = action.payload;
      
      // Get all task IDs in this column
      const column = state.columns.find(col => col.id === columnId);
      if (column) {
        // Delete all tasks in this column
        column.taskIds.forEach(taskId => {
          delete state.tasks[taskId];
        });
        
        // Remove column
        state.columns = state.columns.filter(col => col.id !== columnId);
      }
    }
  }
});

export const {
  fetchBoardStart,
  fetchBoardSuccess,
  fetchBoardFailure,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  addColumn,
  updateColumn,
  deleteColumn
} = boardSlice.actions;

export default boardSlice.reducer;