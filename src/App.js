import React, { useReducer } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Board from './containers/Board';
import history from './components/History';
import './App.css';

export const BoardContext = React.createContext();
export const ListContext = React.createContext();
export const CardContext = React.createContext();

const initialState = {}

const boardReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_BOARD': {
      const { boardId, boardTitle } = action.payload;
      return {
        ...state,
        [boardId]: { id: boardId, title: boardTitle, lists: [] }
      };
    }
    case 'DELETE_BOARD': { 
      const { boardId } = action.payload;
      const { [boardId]: deletedBoard, ...restOfBoards } = state;
      return restOfBoards
    }
    case "ADD_LIST": {
      const { boardId, listId } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          lists: [...state[boardId].lists, listId]
        }
      };
    }
    case "DELETE_LIST": {
      const { listId: newListId, boardId } = action.payload;
      return {
        ...state,
        [boardId]: {
          ...state[boardId],
          lists: state[boardId].lists.filter(listId => listId !== newListId)
        }
      };
    }
    case "REORDER_LISTS": {
      const { sourceIndex, destinationIndex, sourceId } = action.payload;
      const newLists = Array.from(state[sourceId].lists);
      const [removedList] = newLists.splice(sourceIndex, 1);
      newLists.splice(destinationIndex, 0, removedList);
      return {
        ...state,
        [sourceId]: { ...state[sourceId], lists: newLists }
      };
    }
    default:
      return state
  }
}

const listReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_CARD": {
      const { listId, cardId } = action.payload;
      return {
        ...state,
        [listId]: { ...state[listId], cards: [...state[listId].cards, cardId] }
      };
    }
    case "DELETE_CARD": {
      const { cardId: newCardId, listId } = action.payload;
      return {
        ...state,
        [listId]: {
          ...state[listId],
          cards: state[listId].cards.filter(cardId => cardId !== newCardId)
        }
      };
    }
    case "ADD_LIST": {
      const { listId, listTitle } = action.payload;
      return {
        ...state,
        [listId]: { id: listId, title: listTitle, cards: [] }
      };
    }
    case "DELETE_LIST": {
      const { listId } = action.payload;
      const { [listId]: deletedList, ...restOfLists } = state;
      return restOfLists;
    }
    case "EDIT_LIST_TITLE": {
      const { listId, listTitle } = action.payload;
      return {
        ...state,
        [listId]: { ...state[listId], title: listTitle }
      };
    }
    case "REORDER_LIST": {
      const {
        sourceIndex,
        destinationIndex,
        sourceId,
        destinationId
      } = action.payload;
      // Reorder within the same list
      if (sourceId === destinationId) {
        const newCards = Array.from(state[sourceId].cards);
        const [removedCard] = newCards.splice(sourceIndex, 1);
        newCards.splice(destinationIndex, 0, removedCard);
        return {
          ...state,
          [sourceId]: { ...state[sourceId], cards: newCards }
        };
      }

      const sourceCards = Array.from(state[sourceId].cards);
      const [removedCard] = sourceCards.splice(sourceIndex, 1);
      const destinationCards = Array.from(state[destinationId].cards);
      destinationCards.splice(destinationIndex, 0, removedCard);
      return {
        ...state,
        [sourceId]: { ...state[sourceId], cards: sourceCards },
        [destinationId]: { ...state[destinationId], cards: destinationCards }
      };
    }
    default:
      return state;
  }
};

const cardReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_CARD": {
      const { cardTitle, cardId, cardDesc } = action.payload;
      return { ...state, [cardId]: { title: cardTitle, id: cardId, desc: cardDesc, comments: [] } };
    }
    case "EDIT_CARD_TITLE": {
      const { cardTitle, cardId, cardDesc } = action.payload;
      return { ...state, [cardId]: { title: cardTitle, id: cardId, desc: cardDesc, comments: [...state[cardId].comments] } };
    }
    case "DELETE_CARD": {
      const { cardId } = action.payload;
      const { [cardId]: deletedCard, ...restOfCards } = state;
      return restOfCards;
    }
    case "ADD_COMMENT": {
      const { comment, commentDate, cardId } = action.payload;
      return {
        ...state,
        [cardId]: { ...state[cardId], comments: [...state[cardId].comments, { comment: comment,  date: commentDate }] }
      };
    }
    case "DELETE_LIST": {
      const { cards: cardIds } = action.payload;
      return Object.keys(state)
        .filter(cardId => !cardIds.includes(cardId))
        .reduce(
          (newState, cardId) => ({ ...newState, [cardId]: state[cardId] }),
          {}
        );
    }
    default:
      return state;
  }
};

function App() {

  const [boards, dispatch] = useReducer(boardReducer, initialState)
  const [lists, dispatchLists] = useReducer(listReducer, initialState)
  const [cards, dispatchCards] = useReducer(cardReducer, initialState)

  return (
    <BoardContext.Provider
      value={{ boardsState: boards,  boardsDispatch: dispatch}}
    >
      <ListContext.Provider
        value={{ listsState: lists,  listsDispatch: dispatchLists}}
      >
        <CardContext.Provider
          value={{ cardsState: cards,  cardsDispatch: dispatchCards}}
        >
          <div className="App">
            <React.Fragment>
              <Router history={history}>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/board/:boardId" component={Board} />
                </Switch>
              </Router>
            </React.Fragment>
          </div>
        </CardContext.Provider>
      </ListContext.Provider>
    </BoardContext.Provider>
  );
}

export default App;
