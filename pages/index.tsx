import { GetServerSideProps } from "next";
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import React, { FormEvent, useState } from "react";
import Box from "../src/components/Box";
import MainGrid from "../src/components/MainGrid";
import ProfileSideBar from "../src/components/ProfileSideBar";
import RelationsGroup from "../src/components/RelationsBox";
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';

type Comunidade = {
  id?: string;
  title: string | undefined;
  imageUrl: string | undefined;
  url?: string;
  creatorSlug?: string;
}

type Person = {
  id?: string;
  githubUser: string;
}

type Depoimento = {
  id?: string;
  message: string | undefined;
  user: string | undefined;
  _createdAt?: Date;
}

type Scrap = {
  id?: string;
  message: string | undefined;
  user: string | undefined;
  _createdAt?: Date;
}

type HomeProps = {
  githubUser: string;
}

export default function Home(props: HomeProps) {
  const githubUser = props.githubUser;
  const [comunidades, setComunidades] = React.useState<Comunidade[]>([]);
  const [pessoasFavoritas, setPessoasFavoritas] = useState<Person[]>([]);
  const [seguindo, setSeguindo] = useState<any[]>([]);
  const [perfil, setPerfil] = useState({});
  const [showAba, setShowAba] = useState<string>('nenhuma');
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [scraps, setScraps] = useState<Scrap[]>([]);
  const [imagemAleatoria, setImagemAleatoria] = useState<string>('');

  React.useEffect(function () {
    // API github - fetch seguindo
    fetch(`https://api.github.com/users/${githubUser}/following`)
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function (respostaCompleta) {
        setSeguindo(respostaCompleta);
      });

    // API graphQL DatoCMS Comunidades
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

    // fetch Pessoas Favoritas API graphQL DatoCMS
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

    // API github - fetch perfil
    fetch(`https://api.github.com/users/${githubUser}`)
      .then(async (response) => {
        const dados = await response.json();
        setPerfil(dados);
      });

    // API Next - fetch depoimentos
    fetch('/api/depoimentos')
      .then(async (response) => {
        const dados = await response.json();
        setDepoimentos(dados);
      });

    // API Next - fetch scraps
    fetch('/api/scraps')
      .then(async (response) => {
        const dados = await response.json();
        setScraps(dados);
      });

  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} perfil={perfil} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem-vindo(a)</h1>
            <OrkutNostalgicIconSet scraps={scraps.length + depoimentos.length} />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <div className="buttons">
              <button
                onClick={() => setShowAba('Comunidade')}
              >
                Criar Comunidade
              </button>
              <button
                onClick={() => setShowAba('Depoimento')}
              >
                Escrever depoimento
              </button>
              <button
                onClick={() => setShowAba('Scrap')}
              >
                Deixar um scrap
              </button>
            </div>
            {
              showAba === 'Comunidade' &&
              <form onSubmit={function handleCriaComunidade(event: FormEvent<HTMLFormElement>) {
                event.preventDefault();
                const dadosDoForm = new FormData(event.target as HTMLFormElement);
                const comunidade: Comunidade = {
                  title: dadosDoForm.get('title')?.toString(),
                  imageUrl: dadosDoForm.get('imageUrl')?.toString(),
                  url: dadosDoForm.get('url')?.toString(),
                  creatorSlug: "rodolfoHOk",
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(comunidade)
                })
                  .then(async (response) => {
                    const dados = await response.json();
                    // console.log(dados);
                    const comunidadeCriada = dados.registroCriado;
                    setComunidades([...comunidades, comunidadeCriada]);
                  });

              }}>
                <div>
                  <input
                    placeholder="Qual vai ser o nome da sua comunidade?"
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade?"
                    type="text"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <input
                    placeholder="Qual vai ser a url da imagem da sua comunidade?"
                    name="imageUrl"
                    aria-label="Qual vai ser a url da imagem da sua comunidade?"
                    type="text"
                    defaultValue={imagemAleatoria}
                  />
                  <button style={{ height: '45px' }} type="button" onClick={() => {
                    setImagemAleatoria('https://picsum.photos/200/300');
                  }}>
                    Imagem Aleatória
                  </button>
                </div>
                <div>
                  <input
                    placeholder="Qual vai ser a url da da sua comunidade?"
                    name="url"
                    aria-label="Qual vai ser a url da da sua comunidade?"
                    type="text"
                  />
                </div>
                <button type="submit">Criar</button>
              </form>
            }
            {
              showAba === 'Depoimento' &&
              <form onSubmit={function handleCriaComunidade(event: FormEvent<HTMLFormElement>) {
                event.preventDefault();
                const dadosDoForm = new FormData(event.target as HTMLFormElement);
                const depoimento: Depoimento = {
                  message: dadosDoForm.get('message')?.toString(),
                  user: dadosDoForm.get('githubUser')?.toString(),
                }

                fetch('/api/depoimentos', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(depoimento)
                })
                  .then(async (response) => {
                    const dados = await response.json();
                    const depoimentoCriado = dados.registroCriado;
                    setDepoimentos([...depoimentos, depoimentoCriado]);
                  });

              }}>
                <div>
                  <textarea
                    placeholder="Depoimento"
                    name="message"
                    aria-label="Depoimento"
                  />
                </div>
                <div>
                  <input
                    placeholder="Autor (github user)"
                    name="githubUser"
                    aria-label="Autor (github user)"
                    type="text"
                  />
                </div>
                <button type="submit">Enviar</button>
              </form>
            }
            {
              showAba === 'Scrap' &&
              <form onSubmit={function handleCriaComunidade(event: FormEvent<HTMLFormElement>) {
                event.preventDefault();
                const dadosDoForm = new FormData(event.target as HTMLFormElement);
                const scrap: Scrap = {
                  message: dadosDoForm.get('message')?.toString(),
                  user: dadosDoForm.get('githubUser')?.toString(),
                }

                fetch('/api/scraps', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(scrap)
                })
                  .then(async (response) => {
                    const dados = await response.json();
                    const scrapCriada = dados.registroCriado;
                    setScraps([...scraps, scrapCriada]);
                  });

              }}>
                <div>
                  <textarea
                    placeholder="Recado"
                    name="message"
                    aria-label="Recado"
                  />
                </div>
                <div>
                  <input
                    placeholder="Autor (github user)"
                    name="githubUser"
                    aria-label="Autor (github user)"
                    type="text"
                  />
                </div>
                <button type="submit">Enviar</button>
              </form>
            }
          </Box>

          {/* Recados */}
          {
            scraps.length > 0 &&
            <Box>
              <h2 className="subTitle">Scraps</h2>
              {
                scraps.map((scrap) => {
                  return (
                    <Box className="scrap" key={scrap.id}>
                      <span>
                        {scrap.user}:
                        <img src={`https://github.com/${scrap.user}.png`} />
                      </span>
                      <p>{scrap.message}</p>
                      <span className="date">{new Date(scrap._createdAt!).toLocaleDateString()}</span>
                    </Box>
                  );
                })
              }
            </Box>
          }
          {/* Depoimentos */}
          {
            depoimentos.length > 0 &&
            <Box>
              <h2 className="subTitle">Depoimentos</h2>
              {
                depoimentos.map((depoimento) => {
                  return (
                    <Box className="scrap" key={depoimento.id}>
                      <span>
                        {depoimento.user}
                        <img src={`https://github.com/${depoimento.user}.png`} />
                      </span>
                      <p>{depoimento.message}</p>
                      <span className="date">{new Date(depoimento._createdAt!).toLocaleDateString()}</span>
                    </Box>
                  );
                })
              }
            </Box>
          }
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <RelationsGroup title="Seguindo" list={seguindo} linkUrl="/seguindo" />
          <RelationsGroup title="Comunidades" list={comunidades} linkUrl="/comunidades" />
          <RelationsGroup title="Pessoas Favoritas" list={pessoasFavoritas} linkUrl="/favoritas" />
        </div >
      </MainGrid >
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = nookies.get(context).USER_TOKEN;

  const { isAuthenticated } = await fetch('https://alurakut-rodolfohok.vercel.app/api/auth', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => response.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const { githubUser }: any = jwt.decode(token);
  return {
    props: { githubUser },
  }
}
