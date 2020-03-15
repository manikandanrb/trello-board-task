import React, { useContext } from 'react';
import { shape } from 'prop-types';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { BoardContext, ListContext } from '../App';
import List from './List';
import ListAdder from '../components/ListAdder';

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: calc(100vh - 60px);
  overflow-x: auto;
  overflow-y: auto;
  @media (max-width: 1436px) {
    align-items: ${props => props.numLists > 3 && 'self-start'};
  }
  @media (max-width: 1152px) {
    align-items: ${props => props.numLists > 2 && 'self-start'};
  }
  @media (max-width: 868px) {
    align-items: ${props => props.numLists > 1 && 'self-start'};
  }
  @media (max-width: 768px) {
    align-items: center;
    height: 100%;
  }
`

const StyledLinkBack = styled(Link)`
  text-decoration: none;
  color: #ffff !important;
  padding: 30px 70px;
  font-size: 18px;
  font-weight: 600;
  &:hover,
  &:focus,
  &:active {
    opacity: 0.85;
  }
`

const BoardTitle = styled.div`
  position: relative;
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
`

const BoardTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid #dddddd4f;
  justify-content: left;
`

const Board = (props) => {

  const { boardId } = props.match.params;
  const boardsContext = useContext(BoardContext);
  const boards = boardsContext.boardsState;
  const board = boards[boardId];
  let boardTitle = '';
  if(board){
    boardTitle = board.title;
  }
  if(board === undefined){
    props.history.push('/');
  }
  const { boardsDispatch } = boardsContext;

  const listsContext = useContext(ListContext);
  
  const { listsDispatch } = listsContext;
  const listsValue = listsContext.listsState;
  let lists = [];
  if(board !== undefined){
    lists = board.lists.map(listId => listsValue[listId]);
  }

  const handleDragEnd = ({ draggableId, source, destination, type }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }

    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (type === "COLUMN") {
      boardsDispatch(
        {
          type: "REORDER_LISTS",
          payload: {
            sourceId,
            sourceIndex,
            destinationIndex
          }
        }
      );
      return;
    }
    listsDispatch(
      {
        type: "REORDER_LIST",
        payload: {
          sourceId,
          destinationId,
          sourceIndex,
          destinationIndex
        }
      }
    );
  };

  return (
    <React.Fragment>
      <BoardTitleWrapper>
        <BoardTitle>Board Title : {boardTitle}</BoardTitle>
        <StyledLinkBack
          to={'/'}
          >
            Home
        </StyledLinkBack>
      </BoardTitleWrapper>
      <StyledBoard numLists={lists.length}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={boardId} type="COLUMN" direction="horizontal">
            {droppableProvided => (
              <div className="lists-wrapper" ref={droppableProvided.innerRef}>
                {lists.map((list, index) => (
                  <Draggable
                    key={list.id}
                    draggableId={list.id}
                    index={index}
                  >
                    {provided => (
                      <React.Fragment>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          data-react-beautiful-dnd-draggable="0"
                          data-react-beautiful-dnd-drag-handle="0"
                        >
                          <List
                            list={list}
                            boardId={boardId}
                            style={{height: 'initial'}}
                          />
                        </div>
                        {provided.placeholder}
                      </React.Fragment>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
                {
                  <ListAdder boardId={boardId} style={{height: 'initial'}}/>
                }
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </StyledBoard>
    </React.Fragment>
  )
}

Board.propTypes = { 
  match: shape({}).isRequired,
}

export default Board