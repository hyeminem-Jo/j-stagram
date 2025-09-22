import styled from '@emotion/styled';

export const UserSetupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

export const UserSetupForm = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const UserSetupTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
  color: #222;
`;

export const UserSetupDescription = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
`;

export const CheckingText = styled.p`
  font-size: 12px;
  color: #007bff;
  margin-top: -16px;
  margin-bottom: 8px;
`;
