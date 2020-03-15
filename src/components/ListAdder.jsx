import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import ListTitleTextarea from '../components/ListTitleTextarea';
import Button from '../components/Button';
import { ListContext, BoardContext } from '../App';

const ListAdderTextareaWrapper = styled.div`
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
`;

const ListAdder = (props) => {

  const { boardId } = props;

  const listsContext = useContext(ListContext);
  const boardsContext = useContext(BoardContext);
  const { listsDispatch } = listsContext;
  const { boardsDispatch } = boardsContext;

  const [isListInEdit, setisListInEdit] = useState(false)
  const [newListTitle, setnewListTitle] = useState('')

  const handleBlur = () => {
    setisListInEdit(false);
  };
  const handleChange = event => {
    setnewListTitle(event.target.value);
  };
  const handleKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmit();
    }
  };
  const handleSubmit = () => {
    const listId = shortid.generate();
    console.log(newListTitle);
    listsDispatch({
      type: "ADD_LIST",
      payload: { listTitle: newListTitle, listId, boardId }
    });
    boardsDispatch({
      type: "ADD_LIST",
      payload: { listTitle: newListTitle, listId, boardId }
    });
    setisListInEdit(false);
    setnewListTitle('');
  };

  if (!isListInEdit) {
    return (
      <Button
        list='true'
        onClick={() => setisListInEdit(true)}
        text={`Add new list...`}
      />
    );
  }
  return (
    <div className="list">
      <ListAdderTextareaWrapper className="list-title-textarea-wrapper">
        <ListTitleTextarea
          autoFocus
          useCacheForDOMMeasurements
          value={newListTitle}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </ListAdderTextareaWrapper>
    </div>
  )
}

export default ListAdder