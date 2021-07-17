import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { AlurakutMenu } from "../src/lib/AlurakutCommons";
import ProfileSideBar from "../src/components/ProfileSideBar";
import styled from 'styled-components';
import Box from '../src/components/Box';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type ComunidadesPageProps = {
  githubUser: string;
}

type Comunidade = {
  id?: string;
  title: string | undefined;
  imageUrl: string | undefined;
  url?: string;
  creatorSlug?: string;
}

export default function ComunidadesPage({ githubUser }: ComunidadesPageProps) {
  const router = useRouter();
  const [dadosPerfil, setDadosPerfil] = useState<any>({});
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);

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
          allCommunities {
            id
            title
            imageUrl
            url
            creatorSlug
          }
        }`
      })
    }).then((response => response.json())) // pega o retorno do response.json() e já retorna(return)
      .then((respostaCompleta) => { // precisa usar o return algo diferente do acima
        // console.log(respostaCompleta.data.allCommunities);
        setComunidades(respostaCompleta.data.allCommunities);
      });
  }, []);

  return <>
    <AlurakutMenu githubUser={githubUser} logout={() => {
      nookies.destroy(null, 'USER_TOKEN');
      router.push('/login');
    }} />
    <ComunidadesWrapper>
      <aside >
        <ProfileSideBar githubUser={githubUser} perfil={dadosPerfil} />
      </aside>
      <main >
        <Box>
          <div className="image">
            <h1 className="subtitle">Comunidades</h1>
          </div>
          <ul>
            {
              comunidades.map((comunidade) => (
                <li key={comunidade.id}>
                  <img src={comunidade.imageUrl} alt="imagem comunidade" />
                  <div>
                    <p>{comunidade.title}</p>
                    {
                      comunidade.url &&
                      <a href={comunidade.url}>{comunidade.url}</a>
                    }
                    {
                      comunidade.creatorSlug &&
                      <span>criador: {comunidade.creatorSlug}</span>
                    }
                  </div>
                </li >
              ))
            }
          </ul>
        </Box>
      </main>
    </ComunidadesWrapper>
  </>
}

const ComunidadesWrapper = styled.div`
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
        span {
          color: #333;
          padding: 8px 0;
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
