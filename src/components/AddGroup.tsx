import { useState } from 'react';
import { UserType } from '../types/types';

import '../styles/Add&Edit.scss';

type props = {
  userState: UserType;
  setUserState: React.Dispatch<React.SetStateAction<UserType>>;
  saveData: () => void;
  setAddGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultInputs = {
  name: "",
}

export default function AddGroup({
  userState, setUserState, saveData, setAddGroup
}: props) {
  const closeWindow = (): void => {
    setAddGroup(false);
  }

  const handleChange = (property: string, value: any): void => {
    setInputState({...inputState, [property]: value});
  }

  const create = (): void => {
    let newUserState = {...userState};

    let newID = (newUserState.nextID++).toString();
    let newData = {...inputState, id: newID, listIDs: []};

    newUserState.groups.set(newID, newData);
    newUserState.groupIDs.push(newID);

    setUserState({...newUserState});
    setInputState(defaultInputs);
    saveData();
    closeWindow();
  }

  const [inputState, setInputState] = useState(defaultInputs);

  return (
    <div className="Add">
      <div className="Add-bg"
        onClick={closeWindow}
      ></div>
      <div className="Add-main">
        <div className="Add-main-inputs">
          <div className="Add-main-inputs-name">
            <label>Group Name</label>
            <input 
              type="text" 
              value={inputState.name} 
              onChange={(e) => handleChange("name", e.target.value)} 
            />
          </div>
        </div>
        <div className="Add-main-buttons">
          <h3
            onClick={closeWindow}
          >Cancel</h3>
          <h3
            onClick={create}
          >Create</h3>
        </div>
      </div>
    </div>
  );
}