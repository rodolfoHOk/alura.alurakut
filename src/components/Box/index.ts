import styled from "styled-components";

const Box = styled.div`
  background: #b7a89eee;
  border-radius: 5px;
  padding: 16px;
  
  /* CSS Pré-Pronto */
  margin-bottom: 10px;
  .boxLink {
    font-size: 14px;
    color: #090806;
    text-decoration: none;
    font-weight: 800;
  }
  .title {
    font-size: 32px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .subTitle {
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 20px;
  }
  .smallTitle {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 700;
    color: #090806;
    margin-bottom: 20px;
  }
  .buttons {
    margin-bottom: 16px;
  }

  .buttons button {
    margin-right: 8px;
  }

  .perfil {
    margin-top: 8px;
    color: #555;
    font-size: 12px;
  }

  .scrap {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    background-color: #cccccc;
    color: black;
  }

  .scrap p {
    font-size: 16px;
  }

  .scrap span {
    display: flex;
    align-items: top;
    justify-content: space-between;
    font-size: 12px;
    color: #333333;
  }

  .scrap span img {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

  .scrap .date {
    font-size: 10px;
    justify-content: flex-end;
  }

  hr {
    margin-top: 12px;
    margin-bottom: 8px;
    border-color: transparent;
    border-bottom: 2px solid #bdb5a1;
  }
  input {
    width: 100%;
    background-color: #dbdbdb;
    color: #333333;
    border: 0;
    padding: 14px 16px;
    margin-bottom: 14px;
    border-radius: 8px;
    ::placeholder {
      color: #333333;
      opacity: 1;
    }
  }
  textarea {
    width: 100%;
    background-color: #dbdbdb;
    color: #333333;
    border: 0;
    padding: 14px 16px;
    margin-bottom: 14px;
    border-radius: 8px;
    ::placeholder {
      color: #333333;
      opacity: 1;
    }
  }
  button {
    border: 0;
    padding: 8px 12px;
    color: #FFFFFF;
    border-radius: 8px;
    background-color: #2e1503;
  }
`;

export default Box;
