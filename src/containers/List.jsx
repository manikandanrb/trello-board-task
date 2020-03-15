import React, { useState, useContext } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal, ModalBody } from 'reactstrap';
import styled from 'styled-components';
import FaClose from 'react-icons/lib/fa/close';
import shortid from 'shortid';
import ListTitleButton from '../components/ListTitleButton';
import ListTitleTextarea from '../components/ListTitleTextarea';
import DeleteListButton from '../components/DeleteListButton';
import DeleteCardButton from '../components/DeleteCardButton';
import EditCardButton from '../components/EditCardButton';
import CardTextarea from '../components/CardTextarea';
import ClickOutside from '../components/ClickOutside';
import Button from '../components/Button';
import { BoardContext, CardContext, ListContext } from '../App';


const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 10px;
`;

const ListTitleTextareaWrapper = styled.div`
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
`;

const CardTextareaForm = styled(TextareaWrapper.withComponent('form'))`
  margin: 0 10px 10px 10px;
`;

const ComposerWrapper = styled.div`
  display: flex;
  justify-content: center;
  background: #F8F8F8;
  padding: 0 0 10px 0;
  border: none;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

const ListTitle = styled.div`
  display: flex;
  flex-shrink: 0;
  height: 48px;
  align-items: center;
  color: rgb(46,68,78);
`;

const List = (props) => {

  const [newListTitle, setnewListTitle] = useState('')
  const [isListTitleInEdit, setisListTitleInEdit] = useState(false)
  const [editableCardTitle, seteditableCardTitle] = useState('')
  const [editableCardDesc, seteditableCardDesc] = useState(null)
  const [cardInEdit, setcardInEdit] = useState(null)
  const [newCardTitle, setnewCardTitle] = useState('')
  const [newCardDesc, setnewCardDesc] = useState('')
  const [newCardFormIsOpen, setnewCardFormIsOpen] = useState(false)
  
  const { list, boardId } = props

  const [newComment, setnewComment] = useState('')
  const [modal, setModal] = useState(false);
  const [modalCardTitle, setmodalCardTitle] = useState('');
  const [modalCardDesc, setmodalCardDesc] = useState('');
  const [modalCardId, setmodalCardId] = useState(null);
  const [modalEditDesc, setmodalEditDesc] = useState(false);
  const toggle = () => {
    setModal(!modal)
    setmodalEditDesc(false);
    setnewComment('');
  };

  const listsContext = useContext(ListContext);
  const { listsDispatch } = listsContext;

  const boardsContext = useContext(BoardContext);
  const { boardsDispatch } = boardsContext;

  const cardsContext = useContext(CardContext);
  const cardsValue = cardsContext.cardsState;
  const { cardsDispatch } = cardsContext;
  const cards = list.cards.map(cardId => cardsValue[cardId]);
  
  const toggleCardComposer = () => {
    setnewCardFormIsOpen(prevNewCardFormIsOpen => !prevNewCardFormIsOpen);
  }

  const handleCardComposerChange = (event) => {
    setnewCardTitle(event.target.value);
  };

  const handleCommentComposerChange = (event) => {
    setnewComment(event.target.value);
  };

  const handleCardDescComposerChange = (event) => {
    setnewCardDesc(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmitCard(event);
    }
  };

  const handleKeyDownCardDesc = (event) => {
    if (event.keyCode === 13) {
      handleSubmitCardDesc(event);
    }
  };

  const handleKeyDownComment = (event) => {
    if (event.keyCode === 13) {
      handleSubmitComment(event);
    }
  };

  const handleSubmitComment = event => {
    event.preventDefault();
    if (newComment === "") return;
    const commentDate = new Date();
    cardsDispatch({
      type: "ADD_COMMENT",
      payload: { comment: newComment, commentDate:commentDate, cardId: modalCardId }
    });
    setnewComment('');
  };

  const handleSubmitCardDesc = (event) => {
    event.preventDefault();
    if (newCardDesc === "") return;
    cardsDispatch(
      {
        type: "EDIT_CARD_TITLE",
        payload: {
          cardTitle: modalCardTitle,
          cardDesc: newCardDesc,
          cardId: modalCardId
        }
      }  
    );
    setmodalCardDesc(newCardDesc);
    setnewCardDesc('');
  }

  const handleSubmitCardDescEdit = (event) => {
    if (event.keyCode === 13) {
      handleSubmitCardDescEditSave(event);
    }
  };


  const handleSubmitCardDescEditSave = (event) => {
    event.preventDefault();
    cardsDispatch(
      {
        type: "EDIT_CARD_TITLE",
        payload: {
          cardTitle: modalCardTitle,
          cardDesc: editableCardDesc,
          cardId: modalCardId
        }
      }  
    );
    seteditableCardDesc(null);
    setmodalCardDesc(editableCardDesc);
    setmodalEditDesc(false);
  }

  const handleSubmitCard = event => {
    event.preventDefault();
    if (newCardTitle === "") return;
    const cardId = shortid.generate();
    const listId = list.id;
    cardsDispatch({
      type: "ADD_CARD",
      payload: { cardTitle:newCardTitle, cardDesc: newCardDesc, cardId, listId }
    });
    listsDispatch({
      type: "ADD_CARD",
      payload: { cardId, listId }
    });
    setnewCardTitle('');
    setnewCardFormIsOpen(false);
  };

  const openCardEditor = (card) => {
    setcardInEdit(card.id);
    seteditableCardTitle(card.title);
    seteditableCardDesc(card.desc);
  };

  const openModalCardEditor = (card) => {
    setModal(!modal);
    setmodalCardId(card.id);
    setmodalCardDesc(card.desc);
    setmodalCardTitle(card.title);
  };

  const handleCardEditorChange = (event) => {
    seteditableCardTitle(event.target.value);
  };

  const handleCardDescEditorChange = (event) => {
    seteditableCardDesc(event.target.value);
  };

  const handleEditKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmitCardEdit();
    }
  };

  const handleSubmitCardEdit = () => {
    if (editableCardTitle === "") {
      deleteCard(cardInEdit);
    } else {
      cardsDispatch(
        {
          type: "EDIT_CARD_TITLE",
          payload: {
            cardTitle: editableCardTitle,
            cardDesc: editableCardDesc,
            cardId: cardInEdit
          }
        }  
      );
    }
    seteditableCardTitle('');
    setcardInEdit(null);
  };

  const deleteCard = cardId => {
    cardsDispatch(
      { type: "DELETE_CARD", payload: { cardId, listId: list.id } }  
    );
    listsDispatch({ type: "DELETE_CARD", payload: { cardId, listId: list.id } });
  };

  const openTitleEditor = () => {
    setisListTitleInEdit(true);
    setnewListTitle(list.title);
  };

  const handleListTitleEditorChange = (event) => {
    setnewListTitle(event.target.value);
  };

  const handleListTitleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmitListTitle();
    }
  };

  const handleSubmitListTitle = () => {
    if (newListTitle === "") return;
    listsDispatch(
      {
        type: "EDIT_LIST_TITLE",
        payload: {
          listTitle: newListTitle,
          listId: list.id
        }
      }  
    );
    setisListTitleInEdit(false);
    setnewListTitle('');
  };

  const deleteList = () => {
    listsDispatch(
      {
        type: "DELETE_LIST",
        payload: { cards: list.cards, listId: list.id, boardId }
      }  
    );
    boardsDispatch(
      {
        type: "DELETE_LIST",
        payload: { cards: list.cards, listId: list.id, boardId }
      }  
    );
  };

  const comments = cards.find(item => item.id === modalCardId); 
  
  return (
    <div className="list">
      {isListTitleInEdit ? (
        <ListTitleTextareaWrapper>
          <ListTitleTextarea
            autoFocus
            useCacheForDOMMeasurements
            value={newListTitle}
            onChange={handleListTitleEditorChange}
            onKeyDown={handleListTitleKeyDown}
            onBlur={handleSubmitListTitle}
          />
        </ListTitleTextareaWrapper>
      ) : (
        <ListTitle>
          <ListTitleButton
            onFocus={openTitleEditor}
            onClick={openTitleEditor}
            text={list.title}
          />
          <DeleteListButton onClick={deleteList} />
        </ListTitle>
      )}
      <Droppable droppableId={list.id}>
        {provided => (
          <div className="cards" ref={provided.innerRef}>
            {cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {({
                  innerRef,
                  draggableProps,
                  dragHandleProps,
                  placeholder
                }) => (
                  <div>
                    {cardInEdit !== card.id ? (
                      <div
                        className="card-title"
                        ref={innerRef}
                        {...draggableProps}
                        {...dragHandleProps}
                        data-react-beautiful-dnd-draggable="0"
                        data-react-beautiful-dnd-drag-handle="0"
                      >
                        <span onClick={() => openModalCardEditor(card)}>{card.title}</span>
                        <DeleteCardButton onClick={() => deleteCard(card.id)} />
                        <EditCardButton onClick={() => openCardEditor(card)} />
                      </div>
                    ) : (
                      <TextareaWrapper>
                        <CardTextarea
                          autoFocus
                          useCacheForDOMMeasurements
                          value={editableCardTitle}
                          onChange={handleCardEditorChange}
                          onKeyDown={handleEditKeyDown}
                          onBlur={handleSubmitCardEdit}
                        />
                      </TextareaWrapper>
                    )}
                    {placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {newCardFormIsOpen && (
              <ClickOutside handleClickOutside={toggleCardComposer}>
                <CardTextareaForm
                  onSubmit={handleSubmitCard}
                >
                  <CardTextarea
                    autoFocus
                    useCacheForDOMMeasurements
                    onChange={handleCardComposerChange}
                    onKeyDown={handleKeyDown}
                    value={newCardTitle}
                  />
                  <Button
                    add
                    type="submit"
                    text="Add"
                    disabled={newCardTitle === ""}
                  />
                </CardTextareaForm>
              </ClickOutside>
            )}
            {newCardFormIsOpen || (
            <ComposerWrapper>
              <Button
                card
                text="Add new card"
                onClick={toggleCardComposer}
                >
                Add new card
              </Button>
            </ComposerWrapper>
            )}
          </div>
        )}
      </Droppable>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>
          <div className="modal-close">
            <div onClick={toggle}><FaClose /></div>
          </div>
          <div className="modal-form">
            <div>
              <label>Card Title: {modalCardTitle}</label>
            </div>
            <div>
              <label>Card Description: {modalCardDesc !== '' ? <EditCardButton onClick={ () => setmodalEditDesc(true)} /> : '' }</label>
              {
                modalCardDesc === '' ? (
                  <React.Fragment>
                    <CardTextareaForm
                      onSubmit={handleSubmitCardDesc}
                    >
                      <CardTextarea
                        autoFocus
                        useCacheForDOMMeasurements
                        onChange={handleCardDescComposerChange}
                        onKeyDown={handleKeyDownCardDesc}
                        value={newCardDesc}
                      />
                      <Button
                        add
                        type="submit"
                        text="Add"
                        disabled={newCardDesc === ""}
                      />
                    </CardTextareaForm>
                  </React.Fragment>
                ) : [(
                  modalEditDesc ? (
                    <React.Fragment key="edit">
                      <CardTextareaForm
                        onSubmit={handleSubmitCardDescEditSave}
                      >
                        <CardTextarea
                          autoFocus
                          useCacheForDOMMeasurements
                          onChange={handleCardDescEditorChange}
                          onKeyDown={handleSubmitCardDescEdit}
                          value={editableCardDesc === null ? modalCardDesc : editableCardDesc}
                        />
                        <Button
                          add
                          type="submit"
                          text="Save"
                          disabled={editableCardDesc === null}
                        />
                      </CardTextareaForm>
                    </React.Fragment>
                  ) : (
                    <CardTextareaForm>
                      <CardTextarea
                        key="view"
                        autoFocus
                        useCacheForDOMMeasurements
                        value={modalCardDesc}
                        disabled={true}
                      />
                    </CardTextareaForm>
                  )
                )]
              }

            </div>
            <div>
              <label>Comments:</label>
              <CardTextareaForm
                onSubmit={handleSubmitComment}
              >
                <CardTextarea
                  autoFocus
                  useCacheForDOMMeasurements
                  onChange={handleCommentComposerChange}
                  onKeyDown={handleKeyDownComment}
                  value={newComment}
                />
                <Button
                  add
                  type="submit"
                  text="Add"
                  disabled={newComment === ""}
                />
              </CardTextareaForm>
              <div className="comments">
                {
                  comments ? 
                    comments.comments.reverse().map((item, index) => {
                      return (
                      <div className="comment-list" key={index.toString()}>
                        <div>{item.comment}</div>
                        <div>{item.date.toDateString()}</div>
                      </div>)
                    })
                    : null
                }
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default React.memo(List)