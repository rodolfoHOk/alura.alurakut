import { GetServerSideProps } from "next";
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import React, { FormEvent, useState } from "react";
import Box from "../src/components/Box";
import MainGrid from "../src/components/MainGrid";
import ProfileSideBar from "../src/components/ProfileSideBar";
import RelationsGroup from "../src/components/RelationsBox";
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { useRouter } from "next/router";

type Comunidade = {
  id?: string;
  title: string;
  imageUrl: string;
  url?: string;
  creatorSlug: string;
}

type Person = {
  id?: string;
  githubUser: string;
}

type Depoimento = {
  id?: string;
  message: string;
  user: string;
  _createdAt?: Date;
}

type Scrap = {
  id?: string;
  message: string;
  user: string;
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
  const router = useRouter();

  const [novaComunidade, setNovaComunidade] = useState<Comunidade>({
    title: '',
    imageUrl: '',
    url: '',
    creatorSlug: ''
  });
  const [novoDepoimento, setNovoDepoimento] = useState<Depoimento>({
    message: '',
    user: '',
  });
  const [novoScrap, setNovoScrap] = useState<Scrap>({
    message: '',
    user: '',
  });
  const [mensagemErro, setMensagemErro] = useState<string>('');

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

  function logout() {
    nookies.destroy(null, 'USER_TOKEN');
    router.push('/login');
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} logout={logout} />
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
                onClick={() => {
                  setShowAba('Comunidade');
                  setMensagemErro('');
                }}
              >
                Criar Comunidade
              </button>
              <button
                onClick={() => {
                  setShowAba('Depoimento');
                  setMensagemErro('');
                }}
              >
                Escrever depoimento
              </button>
              <button
                onClick={() => {
                  setShowAba('Scrap');
                  setMensagemErro('');
                }}
              >
                Deixar um scrap
              </button>
            </div>
            {
              showAba === 'Comunidade' &&
              <form onSubmit={function handleCriaComunidade(event: FormEvent<HTMLFormElement>) {
                event.preventDefault();

                let erroValidacao: boolean = false;
                setMensagemErro('');
                if (novaComunidade.title.length === 0) {
                  setMensagemErro('Preencha o nome da comunidade');
                  erroValidacao = true;
                }
                if (novaComunidade.imageUrl.length === 0) {
                  setMensagemErro('Preencha a url da imagem da comunidade ou clique no botão imagem aleatória');
                  erroValidacao = true;
                }

                if (!erroValidacao) {
                  fetch('/api/comunidades', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novaComunidade)
                  }).then(async (response) => {
                    const dados = await response.json();
                    const comunidadeCriada = dados.registroCriado;
                    setComunidades([...comunidades, comunidadeCriada]);
                  });
                }
              }}>
                <div>
                  <input
                    placeholder="Qual vai ser o nome da sua comunidade?"
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade?"
                    type="text"
                    value={novaComunidade.title}
                    onChange={(e) => setNovaComunidade({ ...novaComunidade, title: e.target.value, creatorSlug: githubUser })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <input
                    placeholder="Qual vai ser a url da imagem da sua comunidade?"
                    name="imageUrl"
                    aria-label="Qual vai ser a url da imagem da sua comunidade?"
                    type="text"
                    value={novaComunidade.imageUrl}
                    onChange={(e) => setNovaComunidade({ ...novaComunidade, imageUrl: e.target.value })}
                  />
                  <button style={{ height: '45px' }} type="button" onClick={() => {
                    setNovaComunidade({ ...novaComunidade, imageUrl: 'https://picsum.photos/200/300' });
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
                    value={novaComunidade.url}
                    onChange={(e) => setNovaComunidade({ ...novaComunidade, url: e.target.value })}
                  />
                </div>
                {
                  mensagemErro.length !== 0 &&
                  <div style={{ paddingBottom: '8px' }}>
                    <span style={{
                      color: 'red',
                      fontSize: '12px',
                    }}>
                      {mensagemErro}</span>
                  </div>
                }
                <button type="submit">Criar</button>
              </form>
            }
            {
              showAba === 'Depoimento' &&
              <form onSubmit={async function handleCriaComunidade(event: FormEvent<HTMLFormElement>) {
                event.preventDefault();

                let erroValidacao: boolean = false;
                setMensagemErro('');

                if (novoDepoimento.message.length === 0) {
                  setMensagemErro('Preencha o campo depoimento');
                  erroValidacao = true;
                }

                if (!erroValidacao) {
                  setNovoDepoimento({ ...novoDepoimento, user: githubUser });
                  fetch('/api/depoimentos', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novoDepoimento)
                  }).then(async (response) => {
                    const dados = await response.json();
                    const depoimentoCriado = dados.registroCriado;
                    setDepoimentos([...depoimentos, depoimentoCriado]);
                  });
                }

              }}>
                <div>
                  <textarea
                    placeholder="Depoimento"
                    name="message"
                    aria-label="Depoimento"
                    value={novoDepoimento.message}
                    onChange={(e) => setNovoDepoimento({ ...novoDepoimento, message: e.target.value, user: githubUser })}
                  />
                </div>
                {
                  mensagemErro.length !== 0 &&
                  <div style={{ paddingBottom: '8px' }}>
                    <span style={{
                      color: 'red',
                      fontSize: '12px',
                    }}>
                      {mensagemErro}</span>
                  </div>
                }
                <button type="submit">Enviar</button>
              </form>
            }
            {
              showAba === 'Scrap' &&
              <form onSubmit={function handleCriaComunidade(event: FormEvent<HTMLFormElement>) {
                event.preventDefault();

                let erroValidacao: boolean = false;
                setMensagemErro('');

                if (novoScrap.message.length === 0) {
                  setMensagemErro('Preencha o campo de recado');
                  erroValidacao = true;
                }

                if (!erroValidacao) {
                  fetch('/api/scraps', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novoScrap)
                  }).then(async (response) => {
                    const dados = await response.json();
                    const scrapCriada = dados.registroCriado;
                    setScraps([...scraps, scrapCriada]);
                  });
                }
              }}>
                <div>
                  <textarea
                    placeholder="Recado"
                    name="message"
                    aria-label="Recado"
                    value={novoScrap.message}
                    onChange={(e) => setNovoScrap({ ...novoScrap, message: e.target.value, user: githubUser })}
                  />
                </div>
                {
                  mensagemErro.length !== 0 &&
                  <div style={{ paddingBottom: '8px' }}>
                    <span style={{
                      color: 'red',
                      fontSize: '12px',
                    }}>
                      {mensagemErro}</span>
                  </div>
                }
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

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
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
        destination: '/login',
        permanent: false
      }
    }
  }

  const { githubUser }: any = jwt.decode(token);
  return {
    props: { githubUser }
  }
}
