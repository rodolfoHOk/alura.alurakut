import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { AlurakutMenu } from "../src/lib/AlurakutCommons";
import ProfileSideBar from "../src/components/ProfileSideBar";
import styled from 'styled-components';
import Box from '../src/components/Box';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type FavoritasPageProps = {
  githubUser: string;
}

type Person = {
  id?: string;
  githubUser: string;
}

export default function FavoritasPage({ githubUser }: FavoritasPageProps) {
  const router = useRouter();
  const [dadosPerfil, setDadosPerfil] = useState<any>({});
  const [pessoasFavoritas, setPessoasFavoritas] = useState<Person[]>([]);

  useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}`)
      .then(async (response) => {
        const responseData = await response.json();
        setDadosPerfil(responseData);
      });

    const token = process.env.NEXT_PUBLIC_DATO_CMS_READ_TOKEN;
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        'query': `query {
            allFavoritePeople {
              id
              githubUser
            }
          }`
      })
    }).then(async (response) => {
      const dados = await response.json();
      setPessoasFavoritas(dados.data.allFavoritePeople);
    });
  }, []);

  return <>
    <AlurakutMenu githubUser={githubUser} logout={() => {
      nookies.destroy(null, 'USER_TOKEN');
      router.push('/login');
    }} />
    <FavoritasWrapper>
      <aside >
        <ProfileSideBar githubUser={githubUser} perfil={dadosPerfil} />
      </aside>
      <main >
        <Box>
          <div className="image">
            <h1 className="subtitle">Pessoas Favoritas</h1>
          </div>
          <ul>
            {
              pessoasFavoritas.map((pessoa) => (
                <li key={pessoa.id}>
                  <img src={`https://github.com/${pessoa.githubUser}.png`} alt="imagem seguidor" />
                  <div>
                    <p>{pessoa.githubUser}</p>
                    <a href={`https://github.com/${pessoa.githubUser}`}> {`https://github.com/${pessoa.githubUser}`}</a>
                  </div>
                </li >
              ))
            }
          </ul>
        </Box>
      </main>
    </FavoritasWrapper>
  </>
}

const FavoritasWrapper = styled.div`
  width: 100%;
  grid-gap: 10px;
  margin-left: auto;
  margin-right: auto;
  max-width: 500px;
  padding: 16px;
  .profileArea {
    display: none;
    @media(min-width: 860px) {
      display: block;
    }
  }
  @media(min-width: 860px) {
    max-width: 1110px;
    display: grid;
    grid-template-areas: 
      "aside main";
    grid-template-columns: 160px 1fr;
  }

  ul {
    margin: 16px 0;
    display: flex;
    flex-direction: column;

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: #dcd0ba;
      width: 100%;
      border-radius: 8px;
      padding: 16px;

      img {
        display: block;
        width: 100px;
        height: 100px;
        border-radius: 8px;
        margin-right: 32px;
      }
      div {
        display: flex;
        flex-direction: column;
        p {
          color: #2e1503;
          font-size: 18px;
          font-weight: bold;
          padding: 8px 0;
        }
        a {
          text-decoration: none;
          color: #333;
        }
      }
    }
      
    li:nth-child(odd) {
      background-color: #e5c8a8;
      color: #090806;
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = nookies.get(context).USER_TOKEN;

  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    }
  }

  const { isAuthenticated } = await fetch('https://alurakut-rodolfohok.vercel.app/api/auth', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => response.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    }
  }

  const { githubUser }: any = jwt.decode(token);
  return {
    props: { githubUser }
  }
}
