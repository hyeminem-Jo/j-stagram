'use client';

import * as S from './styled';
import Checkbox from '@/app/_modules/common/components/form/checkbox/Checkbox';
import Input from '@/app/_modules/common/components/form/input/Input';
import IconButton from '@/app/_modules/common/components/button/icon-button/IconButton';
import { useEffect, useRef, useState } from 'react';
import CustomDatePicker from '@/app/_modules/common/components/date-picker/CustomDatePicker';
import { TodoRow, updateTodo, deleteTodo } from 'actions/todoActions';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/config/ReactQueryProvider';

const TodoItem = ({
  index,
  todo,
  isNewlyCreated = false,
  onEditComplete,
}: {
  index: number;
  todo: TodoRow;
  isNewlyCreated?: boolean;
  onEditComplete?: () => void;
}) => {
  const [isEdit, setIsEdit] = useState(isNewlyCreated); // 편집 모드 여부
  const [isCompleted, setIsCompleted] = useState(todo?.completed ?? false);
  const [todoTitle, setTodoTitle] = useState(todo?.title ?? '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    todo.endDate ? new Date(todo.endDate) : null,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const updateTodoMutation = useMutation({
    mutationFn: () =>
      updateTodo({
        id: todo.id,
        title: todoTitle,
        completed: isCompleted,
        endDate: selectedDate ? selectedDate.toLocaleDateString('sv-SE') : null,
      }),
    onSuccess: () => {
      setIsEdit(false);
      onEditComplete?.(); // 편집 완료시 초기화
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus();
    }
  }, [isEdit]);

  // 새로 생성된 할 일인 경우 자동으로 편집 모드
  useEffect(() => {
    if (isNewlyCreated) {
      setIsEdit(true);
    }
  }, [isNewlyCreated]);

  return (
    <S.TodoListItem key={index}>
      <S.TodoListItemWrap>
        <Checkbox
          id={`todo-item-checkbox-${index}`}
          checked={isCompleted}
          onChange={(e) => {
            setIsCompleted(e.target.checked);
            updateTodoMutation.mutate();
          }}
        />
        <Input
          id={`todo-item-${index}`}
          value={todoTitle}
          onChange={(e) => {
            setTodoTitle(e.target.value);
          }}
          isUnderline
          isLineThrough={isCompleted && !isEdit}
          isReadonly={!isEdit}
        />
      </S.TodoListItemWrap>
      <S.TodoListItemWrap2>
        <S.TodoListItemWrapDate>
          <S.TodoListItemWrapText>⏰ 마감일:</S.TodoListItemWrapText>{' '}
          <CustomDatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            disabled={updateTodoMutation.isPending || !isEdit}
          />
        </S.TodoListItemWrapDate>
        <S.TodoListItemIcons>
          {isEdit ? (
            <IconButton
              iconName='check'
              loading={updateTodoMutation.isPending}
              onClick={() => {
                updateTodoMutation.mutate();
              }}
            />
          ) : (
            <IconButton iconName='pen' onClick={() => setIsEdit(true)} />
          )}
          <IconButton
            iconName='trash'
            onClick={() => deleteTodoMutation.mutate()}
            loading={deleteTodoMutation.isPending}
          />
        </S.TodoListItemIcons>
      </S.TodoListItemWrap2>
    </S.TodoListItem>
  );
};

export default TodoItem;
