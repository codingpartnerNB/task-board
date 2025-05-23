import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate, getUserInitials, getPriorityColor } from '@/lib/utils';
import { updateTask, deleteTask } from '@/redux/thunks';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const TaskCard = ({ task, boardId, isDragging }) => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTask, setEditedTask] = React.useState({ ...task });
  const [isHovered, setIsHovered] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const assignee = users[task.assignee];

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedTask({ ...task });
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    dispatch(updateTask(boardId, editedTask));
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteTask(boardId, task.id));
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`relative overflow-hidden transition-all duration-300 ${isDragging ? 'opacity-70 scale-95 rotate-1' : 'opacity-100'} shadow-sm hover:shadow-md`}
        style={{
          transform: isHovered ? 'translateY(-2px)' : 'none',
          boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          borderColor: isHovered ? 'rgba(59, 130, 246, 0.2)' : '#e5e7eb'
        }}
      >
        {/* Priority indicator with glow effect */}
        <div className={`absolute top-0 left-0 w-1 h-full ${getPriorityColor(task.priority)} ${isHovered ? 'opacity-100' : 'opacity-90'}`}></div>
        
        {/* Gradient overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent pointer-events-none"></div>
        )}

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start space-x-2">
            <CardTitle className="text-base font-semibold line-clamp-2 text-gray-800">
              {task.title}
            </CardTitle>
            <Badge 
              variant="outline" 
              className={`capitalize border-0 text-xs font-medium px-2 py-0.5 ${getPriorityColor(task.priority, true)}`}
            >
              {task.priority}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <p className="text-sm text-gray-600 line-clamp-3">
            {task.description || <span className="text-gray-400 italic">No description</span>}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {assignee ? (
              <div className="relative">
                <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                  {assignee.photoURL ? (
                    <AvatarImage src={assignee.photoURL} alt={assignee.displayName} className="object-cover" />
                  ) : (
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800">
                      {getUserInitials(assignee.displayName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
              </div>
            ) : (
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarFallback className="text-xs bg-gray-100 text-gray-500">?</AvatarFallback>
              </Avatar>
            )}
            
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-500">
                  {formatDate(task.dueDate)}
                </span>
              </div>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors"
                onClick={handleEdit}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="rounded-lg max-w-md sm:max-w-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-white/50 pointer-events-none"></div>
              <div className="relative z-10">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-purple-800">
                    {isEditing ? 'Edit Task' : 'Task Details'}
                  </DialogTitle>
                  <DialogClose className="absolute right-4 top-4">
                    <X className="h-full w-full invisible" />
                  </DialogClose>
                </DialogHeader>

                {isEditing ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 p-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <Input 
                        value={editedTask.title} 
                        onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                        className="focus:ring-2 focus:ring-purple-500 outline-none focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <Textarea 
                        value={editedTask.description} 
                        onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                        rows={4}
                        className="focus:ring-2 focus:ring-purple-500 outline-none focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <Select 
                          value={editedTask.priority || 'medium'}
                          onValueChange={(value) => setEditedTask({...editedTask, priority: value})}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-purple-500 outline-none focus:border-transparent">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="low" className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                              Low
                            </SelectItem>
                            <SelectItem value="medium" className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                              Medium
                            </SelectItem>
                            <SelectItem value="high" className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                              High
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <Input 
                          type="date" 
                          value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().substring(0, 10) : ''}
                          onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                          className="focus:ring-2 focus:ring-purple-500 outline-none focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                      <Select 
                        value={editedTask.assignee || ''}
                        onValueChange={(value) => setEditedTask({...editedTask, assignee: value})}
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-purple-500 outline-none focus:border-transparent">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {Object.values(users).map((user) => (
                            <SelectItem key={user.uid} value={user.uid} className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                {user.photoURL ? (
                                  <AvatarImage src={user.photoURL} />
                                ) : (
                                  <AvatarFallback className="text-xs">
                                    {getUserInitials(user.displayName)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              {user.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4 p-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {task.description || <span className="text-gray-400 italic">No description provided</span>}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Priority</h4>
                        <Badge 
                          variant="outline" 
                          className={`capitalize border-0 ${getPriorityColor(task.priority, true)}`}
                        >
                          {task.priority || 'medium'}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
                        <Badge variant="outline" className="capitalize border-0 bg-gray-100 text-gray-700">
                          {task.status || 'todo'}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Assignee</h4>
                        <div className="flex items-center space-x-2">
                          {assignee ? (
                            <>
                              <Avatar className="h-8 w-8">
                                {assignee.photoURL ? (
                                  <AvatarImage src={assignee.photoURL} />
                                ) : (
                                  <AvatarFallback className="text-xs">
                                    {getUserInitials(assignee.displayName)}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <span className="text-sm text-gray-700">{assignee.displayName}</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Unassigned</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Due Date</h4>
                        <p className="text-sm text-gray-600">
                          {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Created</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(task.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                <DialogFooter className="flex justify-between items-center pt-4">
                  {isEditing ? (
                    <>
                      <Button 
                        variant="destructive" 
                        onClick={handleDelete}
                        className="bg-red-300 text-red-800 hover:bg-red-400 hover:shadow-sm transition-all"
                      >
                        Delete Task
                      </Button>
                      <div className="flex space-x-2">
                        <DialogClose asChild>
                          <Button 
                            variant="outline" 
                            onClick={handleCancel}
                            className="bg-gray-300 text-gray-800 hover:bg-gray-400 hover:shadow-sm transition-all"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button 
                          onClick={handleSave}
                          className="bg-purple-600 text-purple-200 hover:bg-purple-700 hover:shadow-md transition-all"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button 
                      onClick={handleEdit}
                      className="bg-purple-700 text-purple-200 hover:bg-purple-800 hover:shadow-md transition-all w-full"
                    >
                      Edit Task
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TaskCard;