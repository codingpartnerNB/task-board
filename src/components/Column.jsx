import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, MoreVertical, Edit, X, ChevronDown, Trash2 } from 'lucide-react';
import TaskCard from './TaskCard';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createTask, moveTaskThunk, deleteColumnThunk, updateColumnThunk } from '@/redux/thunks';

const Column = ({ column, tasks, boardId }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: column.id
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleTitleChange = () => {
    if (newTitle.trim() === '') return;
    dispatch(updateColumnThunk(boardId, { id: column.id, title: newTitle }));
    setIsEditing(false);
  };

  const handleDeleteColumn = async () => {
    await dispatch(deleteColumnThunk(boardId, column.id));
    setShowDeleteDialog(false);
  };

  const handleCreateTask = () => {
    if (newTask.title.trim() === '') return;
    
    dispatch(createTask(boardId, newTask, column.id));
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: column.id
    });
    setIsCreatingTask(false);
    setIsDialogOpen(false);
  };

  return (
    <div 
      className={`flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-2xl w-[320px] min-w-[320px] border border-gray-200 transition-all duration-300 transform ${isHovered ? 'scale-[1.01] shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        perspective: '1000px'
      }}
    >
      {/* Column Header with 3D effect */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white rounded-t-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20 pointer-events-none"></div>
        {isEditing ? (
          <div className="flex space-x-2 w-full z-10">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleChange();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button 
              size="sm" 
              onClick={handleTitleChange}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            >
              Save
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 z-10">
              <h3 
                className="font-semibold text-lg text-gray-800 truncate max-w-[180px]" 
                onDoubleClick={() => setIsEditing(true)}
              >
                {column.title}
              </h3>
              <button 
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-400 hover:text-red-600 transition-colors ml-1"
                title="Delete column"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full shadow-inner z-10">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </>
        )}
      </div>
      
      {/* Task List Area with 3D depth effect */}
      <Droppable droppableId={column.id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-3 transition-all duration-200 ${
              snapshot.isDraggingOver ? 'bg-blue-50/50 backdrop-blur-sm' : ''
            }`}
            style={{ 
              maxHeight: 'calc(100vh - 220px)',
              background: snapshot.isDraggingOver 
                ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(255,255,255,0.8) 70%)' 
                : 'transparent'
            }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      transform: snapshot.isDragging 
                        ? `${provided.draggableProps.style.transform} rotate(2deg)`
                        : provided.draggableProps.style.transform,
                      boxShadow: snapshot.isDragging
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                      zIndex: snapshot.isDragging ? 1000 : 'auto',
                    }}
                  >
                    <TaskCard 
                      task={task} 
                      boardId={boardId} 
                      isDragging={snapshot.isDragging} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {/* Empty state with 3D effect */}
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 mb-4 bg-gray-100 rounded-lg flex items-center justify-center shadow-inner transform rotate-6">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No tasks yet</p>
                <p className="text-gray-400 text-sm">Drag tasks here or click below</p>
              </div>
            )}
          </div>
        )}
      </Droppable>
      
      {/* Add Task Button with 3D effect */}
      <div className="p-3 border-t border-gray-200 bg-gradient-to-t from-white to-gray-50 rounded-b-xl">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full justify-start group relative overflow-hidden"
              onClick={() => setIsCreatingTask(true)}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                <Plus className="mr-2 h-4 w-4" />
                Add task
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl shadow-2xl border-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-70 pointer-events-none"></div>
            <div className="relative z-10">
              <DialogHeader className="border-b border-gray-200 pb-4">
                <DialogTitle className="text-2xl font-bold text-purple-800">Create New Task</DialogTitle>
                <DialogClose className="absolute right-4 top-4">
                  <X className="h-4 w-4 invisible" />
                </DialogClose>
              </DialogHeader>
              <div className="space-y-4 p-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium leading-none text-gray-700">Title</label>
                  <Input 
                    value={newTask.title} 
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                    className="mt-1 border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none focus:border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium leading-none text-gray-700">Description</label>
                  <textarea
                    value={newTask.description} 
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Enter task description"
                    rows={3}
                    className="w-full mt-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-purple-500 outline-none focus:border-transparent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium leading-none text-gray-700">Priority</label>
                  <div className="relative">
                    <select 
                      value={newTask.priority} 
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full mt-1 border border-gray-300 rounded-md p-2 appearance-none focus:ring-2 focus:ring-purple-500 outline-none focus:border-transparent bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <DialogFooter className="border-t border-gray-200 pt-4 gap-4">
                <DialogClose asChild>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 bg-gray-300 text-gray-800 hover:bg-gray-400"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  onClick={handleCreateTask}
                  className="bg-purple-800 text-purple-200 hover:bg-purple-900 shadow-md"
                >
                  Create Task
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Column Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-xl shadow-2xl border-0 overflow-hidden max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-700">Delete Column?</DialogTitle>
          </DialogHeader>
          <div className="p-3 text-gray-700">Are you sure you want to delete this column and all its tasks? This action cannot be undone.</div>
          <DialogFooter className="flex gap-2 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="bg-gray-200 text-gray-700" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleDeleteColumn} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Column;