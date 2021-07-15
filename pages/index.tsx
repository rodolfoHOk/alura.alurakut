import React, { FormEvent, useState } from "react";
import Box from "../src/components/Box";
import MainGrid from "../src/components/MainGrid";
import ProfileSideBar from "../src/components/ProfileSideBar";
import RelationsGroup from "../src/components/RelationsBox";
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';


type Comunidade = {
  id?: string | undefined;
  title: string | undefined;
  imageUrl: string | undefined;
  url?: string | undefined;
  creatorSlug?: string | undefined;
}

export default function Home() {
  const githubUser = 'rodolfoHOk';
  const [comunidades, setComunidades] = React.useState<Comunidade[]>([]);
  const pessoasFavoritas = [
    'guilhermeSilveira',
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
  ];
  const [seguindo, setSeguindo] = useState<any[]>([]);
  const [imagemAleatoria, setImagemAleatoria] = useState<string>('');

  React.useEffect(function () {
    // API github - GET fetch
    fetch('https://api.github.com/users/rodolfoHOk/following')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function (respostaCompleta) {
        setSeguindo(respostaCompleta);
      });

    // API graphQL DatoCMS
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
    })
      .then((response => response.json())) // pega o retorno do response.json() e já retorna(return)
      .then((respostaCompleta) => { // precisa usar o return algo diferente do acima
        // console.log(respostaCompleta.data.allCommunities);
        setComunidades(respostaCompleta.data.allCommunities);
      });
  }, []);



  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem-vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
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
              <button type="submit">Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <RelationsGroup title="Seguindo" list={seguindo} />
          <RelationsGroup title="Comunidades" list={comunidades} />
          <RelationsGroup title="Pessoas Favoritas" list={pessoasFavoritas} />
        </div >
      </MainGrid >
    </>
  )
}