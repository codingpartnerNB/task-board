import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import { fetchBoard, moveTaskThunk, addColumn } from '@/redux/thunks';
import Column from './Column';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const Board = ({ boardId = 'default-board' }) => {
  const dispatch = useDispatch();
  const { columns, tasks, loading, error } = useSelector(state => state.board);
  const [newColumnTitle, setNewColumnTitle] = React.useState('');
  const [showDialog, setShowDialog] = React.useState(false);

  useEffect(() => {
    dispatch(fetchBoard(boardId));
  }, [dispatch, boardId]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    if (type === 'task') {
      dispatch(moveTaskThunk(boardId, draggableId, source, destination));
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim() === '') return;

    dispatch(addColumn(boardId, {
      id: generateId(),
      title: newColumnTitle
    }));

    setNewColumnTitle('');
    setShowDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          <p className="text-lg font-medium text-gray-700">Loading your board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg border border-red-200 max-w-md">
          <h3 className="text-xl font-bold text-red-600">Error Loading Board</h3>
          <p className="text-gray-600 text-center">{error}</p>
          <Button 
            onClick={() => dispatch(fetchBoard(boardId))}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 md:p-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-nowrap overflow-x-auto py-4 gap-4 md:gap-6 h-full">
          {columns.map(column => {
            const columnTasks = column.taskIds.map(taskId => tasks[taskId]).filter(Boolean);
            return (
              <Column 
                key={column.id} 
                column={column} 
                tasks={columnTasks}
                boardId={boardId}
              />
            );
          })}

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost"
                className="min-w-[280px] min-h-[400px] bg-white/90 hover:bg-white backdrop-blur-sm border-2 border-dashed border-purple-300 hover:border-purple-400 rounded-lg flex flex-col items-center justify-center gap-3 p-6 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                  <Plus className="h-6 w-6 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                </div>
                <span className="text-lg font-medium text-purple-500 group-hover:text-purple-700 transition-colors duration-300">
                  Add New Column
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-lg border border-gray-200 shadow-xl">
              <div className="mx-auto w-full p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-purple-800 text-center">
                    Create New Column
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Column Title
                  </label>
                  <Input
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    placeholder="e.g. 'In Progress' or 'Done'"
                    className="w-full bg-gray-50 border-gray-300 focus:border-purple-500 focus:ring-purple-500 outline-none rounded-md"
                  />
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDialog(false)}
                    className="w-full border-gray-300 bg-gray-300 hover:bg-gray-400 text-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddColumn}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-purple-200 shadow-md hover:shadow-lg transition-all"
                  >
                    Create Column
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;