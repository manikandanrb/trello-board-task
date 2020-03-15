import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import Button from '../components/Button'
import styled from 'styled-components';
import FaTimesCircle from 'react-icons/lib/fa/times-circle';
import { BoardContext } from '../App';

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const HomeTitle = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
  @media (max-width: 768px) {
      font-size: 1.25rem;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
  &:hover,
  &:focus,
  &:active {
    opacity: 0.85;
  }
`

const StyledForm = styled.form`
  margin: 12px 0 0 0;
  width: 100%;
  padding: 12px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const StyledInput = styled.input`
  width: 400px;
  color: rgb(46, 68, 78);
  border-radius: 4px;
  box-shadow: inset 0 0 0 2px rgba(0,0,0,0.1);
  border: none;
  padding: 8px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-family: inherit;
  outline: none;
  resize: none;
  font-size: 16px;
  margin-right: 12px;
  &:hover,
  &:focus,
  &:active {
    box-shadow: inset 0 0 0 2px rgba(0,0,0,0.3);
  }
`

const List = styled.div`
  margin-top: 1rem;
  padding: 12px 12px 12px;
  background: #F8F8F8;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  width: 500px;
  @media (max-width: 768px) {
    width: 320px;
    font-size: 14px;
  }
`

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding: 12px 0;
`

const StyledDeleteBoardButton = styled.button`
  border: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: transparent;
  color: rgb(46,68,78);
  cursor: pointer;
  font-size: 16px;
  opacity: 0.8;
  &:hover,
  &:focus,
  &:active {
    color: #DA3849;
    opacity: 1;
    outline: none;
    border:none;
  }
`

const Home = () => {

  const boardsContext = useContext(BoardContext);
  const boards = Object.values(boardsContext.boardsState);
  const { boardsDispatch } = boardsContext;

  const [boardTitle, setboardTitle] = useState('')

  const inputRef = useRef(null)

  useEffect(() => {
    // focus the input element
    inputRef.current.focus();
  }, [])

  const handleTitleChange = (event) => {
    setboardTitle(event.target.value);
  }

  const addBoard = (boardTitle, event) => {
    event.preventDefault();
    setboardTitle('');
    const boardId = shortid.generate()
    boardsDispatch({
      type: "ADD_BOARD",
      payload: { boardTitle, boardId }
    });
  };

  const deleteBoard = boardId => {
    boardsDispatch({
      type: "DELETE_BOARD",
      payload: { boardId }
    });
  };

  return (
    <StyledHome>
      <HomeTitle>Tasks Board</HomeTitle>
      <List>
        {boards.map(board => (
          <Row key={`row-${board.id}`}>
            <StyledLink
              to={`board/${board.id}`}
              >
                {board.title}
            </StyledLink>
            <StyledDeleteBoardButton
              onClick={() => deleteBoard(board.id)}
              >
              <FaTimesCircle />
            </StyledDeleteBoardButton>
          </Row>
        ))}
        <StyledForm onSubmit={(e) => addBoard(boardTitle, e)}>
          <StyledInput
            ref={inputRef}
            value={boardTitle}
            onChange={handleTitleChange}
            placeholder="Add a new board"
          />
          <Button
            type="submit"
            value="Submit"
            text="Add"
            disabled={!boardTitle}
            board
          />
        </StyledForm>
      </List>
    </StyledHome>
  )
}

export default Home