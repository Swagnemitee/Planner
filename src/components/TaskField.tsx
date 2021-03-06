import '../styles/TaskField.scss';

import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { UserType } from '../types/types';
import TaskGroup from './TaskGroup';
import { useState } from 'react';
import AddList from './AddList';
import AddTask from './AddTask';
import EditTask from './EditTask';
import EditGroup from './EditGroup';
import EditList from './EditList';

type props = {
  userState: UserType;
  setUserState: React.Dispatch<React.SetStateAction<UserType>>;
  saveData: () => void;
  saveMemento: () => void;
}

export default function TaskField({
  userState, setUserState, saveData, saveMemento
}: props) {
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    saveMemento();

    const newUserState = {...userState};

    switch (type) {
      case "task":
        const sourceList = newUserState.lists[source.droppableId];
        sourceList.taskIDs.splice(source.index, 1);

        const destinationList = newUserState.lists[destination.droppableId];
        destinationList.taskIDs.splice(destination.index, 0, draggableId);
        break;

      case "list":
        const sourceGroup = newUserState.groups[source.droppableId];
        sourceGroup.listIDs.splice(source.index, 1);

        const destinationGroup = newUserState.groups[destination.droppableId];
        destinationGroup.listIDs.splice(destination.index, 0, draggableId);
        break;

      case "group":
        newUserState.groupIDs.splice(source.index, 1);
        newUserState.groupIDs.splice(destination.index, 0, draggableId);
        break;
    }

    setUserState(newUserState);
    saveData();
  }

  const [editGroup, setEditGroup] = useState(false);
  const [addList, setAddList] = useState(false);
  const [editList, setEditList] = useState(false);
  const [addTask, setAddTask] = useState(false);
  const [editTask, setEditTask] = useState(false);
  const [selectedID, setSelectedID] = useState("");
  const [selectedParentID, setSelectedParentID] = useState("");

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable 
          droppableId="field"
          direction="horizontal"
          type="group"
        > 
          {(provided) =>
            <div className="TaskField"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              { 
                userState.groupIDs.map((id, groupIndex) => 
                  <TaskGroup
                    key={id}
                    userState={userState}
                    setUserState={setUserState}
                    saveData = {saveData}
                    saveMemento = {saveMemento}
                    setSelectedID={setSelectedID}
                    setEditGroup={setEditGroup}
                    setAddList={setAddList}
                    setEditList={setEditList}
                    setAddTask={setAddTask}
                    setEditTask={setEditTask}
                    setSelectedParentID={setSelectedParentID}
                    group={userState.groups[id]}
                    groupIndex={groupIndex}
                  />
                )
              }
              {provided.placeholder}
            </div>
          }
        </Droppable>
      </DragDropContext>
      {
        editGroup &&
        <EditGroup 
          userState={userState}
          setUserState={setUserState}
          saveData={saveData}
          setEditGroup={setEditGroup}
          saveMemento = {saveMemento}
          groupID={selectedID}
        />
      }
      {
        addList &&
        <AddList 
          userState={userState}
          setUserState={setUserState}
          saveData={saveData}
          setAddList={setAddList}
          saveMemento = {saveMemento}
          groupID={selectedID}
        />
      }
      {
        editList &&
        <EditList 
          userState={userState}
          setUserState={setUserState}
          saveData={saveData}
          setEditList={setEditList}
          saveMemento = {saveMemento}
          groupID={selectedParentID}
          listID={selectedID}
        />
      }
      {
        addTask &&
        <AddTask 
          userState={userState}
          setUserState={setUserState}
          saveData={saveData}
          setAddTask={setAddTask}
          saveMemento = {saveMemento}
          listID={selectedID}
        />
      }
      {
        editTask &&
        <EditTask 
          userState={userState}
          setUserState={setUserState}
          saveData={saveData}
          setEditTask={setEditTask}
          saveMemento = {saveMemento}
          listID={selectedParentID}
          taskID={selectedID}
        />
      }
    </>
  );
}