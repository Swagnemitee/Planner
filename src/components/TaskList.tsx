import '../styles/TaskList.scss';
import { TaskListType, UserType } from '../types/types';
import { Reset } from '../types/enums';
import Task from './Task';
import { Droppable, Draggable } from 'react-beautiful-dnd';

type props = {
  userState: UserType;
  setUserState: React.Dispatch<React.SetStateAction<UserType>>;
  saveData: () => void;
  saveMemento: () => void;
  setSelectedID: React.Dispatch<React.SetStateAction<string>>;
  setEditList: React.Dispatch<React.SetStateAction<boolean>>;
  setAddTask: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTask: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedParentID: React.Dispatch<React.SetStateAction<string>>;
  parentID: string;
  list: TaskListType;
  listIndex: number;
}

export default function TaskList({
  userState, setUserState, list, listIndex, saveData, setAddTask, setEditList, setSelectedID, setEditTask, parentID, setSelectedParentID, saveMemento
}: props) {
  return (
    <Draggable draggableId={list.id} index={listIndex}>
      {(provided) =>
        <div className="TaskList"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="TaskList-title"
            {...provided.dragHandleProps}
          > 
            {
              list.reset === Reset.NEVER ||
              list.name.toLowerCase() === listReset[list.reset].toLowerCase() ? 
              <h3>{list.name}</h3> :
              <h3>{list.name}<span> • {listReset[list.reset]}</span></h3>
            }
            <div className="divider"></div>
            <img src="icons/add.png" alt="Add"
              onClick={() =>{ setAddTask(true); setSelectedID(list.id)}}
            />
            <img src="icons/more.png" alt="More"
              onClick={() => {setEditList(true); setSelectedID(list.id); setSelectedParentID(parentID)}}
            />
          </div>
          <Droppable droppableId={list.id} type="task">
            {provided => (
              <div
                className="Task-wrapper"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {
                  list.taskIDs.map((id, taskIndex) => 
                    <Task
                      key={id}
                      userState={userState}
                      setUserState={setUserState}
                      saveData = {saveData}
                      saveMemento = {saveMemento}
                      setSelectedID={setSelectedID}
                      setEditTask={setEditTask}
                      setSelectedParentID={setSelectedParentID}
                      parentID={list.id}
                      task={userState.tasks[id]}
                      index={taskIndex}
                    />
                  )
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      }
    </Draggable>
  );
}

const listReset: {[key in "day" | "week" | "month"]: string} = {
  "day": "daily",
  "week": "weekly",
  "month": "monthly"
}