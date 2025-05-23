import { 
  loginStart, 
  loginSuccess, 
  loginFailure,
  logout as logoutAction
} from './slices/authSlice';
import {
  fetchBoardStart,
  fetchBoardSuccess,
  fetchBoardFailure,
  addTask as addTaskAction,
  updateTask as updateTaskAction,
  deleteTask as deleteTaskAction,
  moveTask as moveTaskAction,
  addColumn as addColumnAction
} from './slices/boardSlice';
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure
} from './slices/usersSlice';
import { auth, firestore, database } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { ref, set, onValue, off } from 'firebase/database';
import { socket } from '../lib/socket';

// Auth thunks
export const registerUser = (email, password, displayName) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateFirebaseProfile(userCredential.user, {
      displayName
    });
    
    // Create user document in Firestore
    await setDoc(doc(firestore, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName,
      photoURL: userCredential.user.photoURL,
      createdAt: new Date().toISOString()
    });
    
    dispatch(loginSuccess({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName,
      photoURL: userCredential.user.photoURL
    }));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    dispatch(loginSuccess({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }));
    
    // Update online status
    const userStatusRef = ref(database, `status/${user.uid}`);
    set(userStatusRef, {
      online: true,
      lastSeen: new Date().toISOString()
    });
    
    // Connect socket
    socket.auth = { userId: user.uid };
    socket.connect();
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Update online status
      const userStatusRef = ref(database, `status/${user.uid}`);
      set(userStatusRef, {
        online: false,
        lastSeen: new Date().toISOString()
      });
    }
    
    // Disconnect socket
    socket.disconnect();
    
    await signOut(auth);
    dispatch(logoutAction());
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Board thunks
export const fetchBoard = (boardId) => async (dispatch, getState) => {
  try {
    if (!boardId) throw new Error('Invalid board ID');
    const { auth } = getState();
    console.log('Fetching board:', boardId, 'User:', auth.user);
    dispatch(fetchBoardStart());
    const boardRef = doc(firestore, 'boards', boardId);
    const boardSnapshot = await getDoc(boardRef);
    
    if (!boardSnapshot.exists()) {
      throw new Error('Board not found');
    }
    
    const boardData = boardSnapshot.data();
    
    // Get columns
    const columnsRef = collection(firestore, 'boards', boardId, 'columns');
    const columnsSnapshot = await getDocs(columnsRef);
    const columns = [];
    
    columnsSnapshot.forEach(doc => {
      columns.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Get tasks
    const tasksRef = collection(firestore, 'boards', boardId, 'tasks');
    const tasksSnapshot = await getDocs(tasksRef);
    const tasks = {};
    
    tasksSnapshot.forEach(doc => {
      tasks[doc.id] = {
        id: doc.id,
        ...doc.data()
      };
    });
    
    dispatch(fetchBoardSuccess({
      columns,
      tasks
    }));
  } catch (error) {
    dispatch(fetchBoardFailure(error.message));
  }
};

export const createTask = (boardId, task, columnId) => async (dispatch, getState) => {
  try {
    const { auth } = getState();
    const newTask = {
      ...task,
      createdBy: auth.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to Firestore
    const taskRef = doc(collection(firestore, 'boards', boardId, 'tasks'));
    newTask.id = taskRef.id;
    await setDoc(taskRef, newTask);
    
    // Update column in Firestore
    const columnRef = doc(firestore, 'boards', boardId, 'columns', columnId);
    const columnDoc = await getDoc(columnRef);
    const column = columnDoc.data();
    const updatedTaskIds = [...column.taskIds, newTask.id];
    
    await updateDoc(columnRef, {
      taskIds: updatedTaskIds
    });
    
    // Dispatch to Redux
    dispatch(addTaskAction({
      task: newTask,
      columnId
    }));
    
    // Emit to Socket.io
    socket.emit('createTask', {
      boardId,
      task: newTask,
      columnId
    });
    
    return newTask;
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
};

export const updateTask = (boardId, task) => async (dispatch) => {
  try {
    const updatedTask = {
      ...task,
      updatedAt: new Date().toISOString()
    };
    
    // Update in Firestore
    const taskRef = doc(firestore, 'boards', boardId, 'tasks', task.id);
    await updateDoc(taskRef, updatedTask);
    
    // Dispatch to Redux
    dispatch(updateTaskAction(updatedTask));
    
    // Emit to Socket.io
    socket.emit('updateTask', {
      boardId,
      task: updatedTask
    });
    
    return updatedTask;
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
};

export const deleteTask = (boardId, taskId) => async (dispatch) => {
  try {
    // Delete from Firestore
    const taskRef = doc(firestore, 'boards', boardId, 'tasks', taskId);
    await deleteDoc(taskRef);
    
    // Dispatch to Redux
    dispatch(deleteTaskAction(taskId));
    
    // Emit to Socket.io
    socket.emit('deleteTask', {
      boardId,
      taskId
    });
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
};

export const moveTaskThunk = (boardId, taskId, source, destination) => async (dispatch) => {
  try {
    // Dispatch to Redux first for immediate UI update
    dispatch(moveTaskAction({
      taskId,
      source,
      destination
    }));
    
    // Update source column in Firestore
    const sourceColumnRef = doc(firestore, 'boards', boardId, 'columns', source.columnId);
    const sourceColumnDoc = await getDoc(sourceColumnRef);
    let sourceColumn = sourceColumnDoc.data();
    let sourceTaskIds = [...sourceColumn.taskIds];
    sourceTaskIds.splice(source.index, 1);
    
    await updateDoc(sourceColumnRef, {
      taskIds: sourceTaskIds
    });
    
    // Update destination column in Firestore
    const destColumnRef = doc(firestore, 'boards', boardId, 'columns', destination.columnId);
    const destColumnDoc = await getDoc(destColumnRef);
    let destColumn = destColumnDoc.data();
    let destTaskIds = [...destColumn.taskIds];
    destTaskIds.splice(destination.index, 0, taskId);
    
    await updateDoc(destColumnRef, {
      taskIds: destTaskIds
    });
    
    // Update task status if column changed
    if (source.columnId !== destination.columnId) {
      const taskRef = doc(firestore, 'boards', boardId, 'tasks', taskId);
      await updateDoc(taskRef, {
        status: destination.columnId,
        updatedAt: new Date().toISOString()
      });
    }
    
    // Emit to Socket.io
    socket.emit('moveTask', {
      boardId,
      taskId,
      source,
      destination
    });
  } catch (error) {
    console.error('Move task error:', error);
    throw error;
  }
};

export const addColumn = (boardId, column) => async (dispatch) => {
  try {
    // Add to Firestore
    const columnRef = doc(collection(firestore, 'boards', boardId, 'columns'));
    const newColumn = { ...column, id: columnRef.id, taskIds: [] };
    await setDoc(columnRef, newColumn);

    // Dispatch to Redux
    dispatch(addColumnAction(newColumn));

    // Optionally emit to socket
    socket.emit('addColumn', { boardId, column: newColumn });

    return newColumn;
  } catch (error) {
    console.error('Add column error:', error);
    throw error;
  }
};

export const deleteColumnThunk = (boardId, columnId) => async (dispatch, getState) => {
  try {
    // Delete all tasks in this column from Firestore
    const columnRef = doc(firestore, 'boards', boardId, 'columns', columnId);
    const columnDoc = await getDoc(columnRef);
    if (!columnDoc.exists()) throw new Error('Column not found');
    const columnData = columnDoc.data();
    if (columnData.taskIds && columnData.taskIds.length > 0) {
      for (const taskId of columnData.taskIds) {
        const taskRef = doc(firestore, 'boards', boardId, 'tasks', taskId);
        await deleteDoc(taskRef);
      }
    }
    // Delete the column itself
    await deleteDoc(columnRef);
    // Dispatch to Redux
    dispatch({ type: 'board/deleteColumn', payload: columnId });
    // Emit to Socket.io
    socket.emit('deleteColumn', { boardId, columnId });
  } catch (error) {
    console.error('Delete column error:', error);
    throw error;
  }
};

export const updateColumnThunk = (boardId, { id, title }) => async (dispatch) => {
  try {
    const columnRef = doc(firestore, 'boards', boardId, 'columns', id);
    await updateDoc(columnRef, { title });
    dispatch({ type: 'board/updateColumn', payload: { id, title } });
    // Optionally emit to socket
    socket.emit('updateColumn', { boardId, id, title });
  } catch (error) {
    console.error('Update column error:', error);
    throw error;
  }
};

// Users thunks
export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch(fetchUsersStart());
    
    const usersRef = collection(firestore, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const users = {};
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      users[doc.id] = userData;
    });
    
    dispatch(fetchUsersSuccess(users));
  } catch (error) {
    dispatch(fetchUsersFailure(error.message));
  }
};