import styled from '@emotion/styled';

export const TextareaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Textarea = styled.textarea<{
  $resize: 'none' | 'both' | 'horizontal' | 'vertical';
  $hasError: boolean;
}>`
  width: 100%;
  min-height: 100px;
  padding: 12px 16px;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#ff4757' : '#e1e5e9')};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  resize: ${({ $resize }) => $resize};
  outline: none;
  transition: border-color 0.1s ease;
  background-color: #fff;
  font-size: 15px;

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? '#ff4757' : '#222')};
  }

  &:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

export const TextareaError = styled.span`
  font-size: 1.3rem;
  color: #ff4757;
  margin-top: 0.2rem;
`;
