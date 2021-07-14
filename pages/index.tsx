import React, { FormEvent, useState } from "react";
import Box from "../src/components/Box";
import MainGrid from "../src/components/MainGrid";
import ProfileSideBar from "../src/components/ProfileSideBar";
import RelationsGroup from "../src/components/RelationsBox";
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';


type Comunidade = {
  id: string | undefined;
  title: string | undefined;
  image: string | undefined;
  link?: string | undefined;
}

export default function Home() {
  const githubUser = 'rodolfoHOk';
  const [comunidades, setComunidades] = React.useState<Comunidade[]>([
    {
      id: new Date().toISOString() + '0',
      title: 'Eu odeio acordar cedo',
      image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
    },
    {
      id: new Date().toISOString() + '1',
      title: 'Bom Dia Grupo',
      image: 'https://scontent.fgru5-1.fna.fbcdn.net/v/t1.18169-9/18158027_1402095553170480_4991385526725287454_n.jpg?_nc_cat=102&ccb=1-3&_nc_sid=8631f5&_nc_ohc=cmtLdz9jDMMAX-EowBs&_nc_ht=scontent.fgru5-1.fna&oh=1e5ec3f91cceb40b4af8a0d00cddeaac&oe=60F22C39',
      link: 'https://www.facebook.com/groups/466934906807698'
    },
    {
      id: new Date().toISOString() + '2',
      title: 'Elétrica e Automação',
      image: 'https://scontent.fgru5-1.fna.fbcdn.net/v/t1.6435-9/107058499_3070759449698333_4041974156150504259_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=8631f5&_nc_ohc=2i0Gu8upUcYAX_n5uOu&_nc_ht=scontent.fgru5-1.fna&oh=9b22d26c0bb82a5a89f077cda0081d0b&oe=60F39F2E',
      link: 'https://www.facebook.com/groups/747182999389387'
    },
    {
      id: new Date().toISOString() + '3',
      title: 'Comunidade Java e Front-end',
      image: 'https://scontent.fgru5-1.fna.fbcdn.net/v/t1.6435-9/55803452_3102326783126855_8566962340942053376_n.png?_nc_cat=106&ccb=1-3&_nc_sid=8631f5&_nc_ohc=gsP-Qq4XkaUAX_4Hkrq&_nc_ht=scontent.fgru5-1.fna&oh=8b22ec6adc6b585140cf264955a31d96&oe=60F23099',
      link: 'https://www.facebook.com/groups/1467881680180826'
    },
    {
      id: new Date().toISOString() + '4',
      title: 'Kardec e o Espiritismo',
      image: 'https://scontent.fgru5-1.fna.fbcdn.net/v/t1.6435-9/109107158_196437295151830_7030444917738345375_n.jpg?_nc_cat=106&ccb=1-3&_nc_sid=8631f5&_nc_ohc=U7-EqQsYo2kAX8Ka_Na&tn=u7k6wfXtyFFtq5lY&_nc_ht=scontent.fgru5-1.fna&oh=7759518093f674b2413170d03aa1143a&oe=60F36285',
      link: 'https://www.facebook.com/groups/386640802207058'
    },
    {
      id: new Date().toISOString() + '5',
      title: 'Japanese Enka',
      image: 'https://scontent.fgru5-1.fna.fbcdn.net/v/t1.6435-9/208444747_546796636490218_8758158946245022483_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=8631f5&_nc_ohc=RlP934Uv7G0AX9aHtkN&_nc_ht=scontent.fgru5-1.fna&oh=1c111d3be9d62363de5a9a13c856e2db&oe=60F28152',
      link: 'https://www.facebook.com/groups/449497979150234'
    },
  ]);
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
    fetch('https://api.github.com/users/rodolfoHOk/following')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function (respostaCompleta) {
        setSeguindo(respostaCompleta);
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
                id: new Date().toISOString(),
                title: dadosDoForm.get('title')?.toString(),
                image: dadosDoForm.get('image')?.toString(),
                link: dadosDoForm.get('link')?.toString()
              }
              setComunidades([...comunidades, comunidade]);
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
                  name="image"
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
                  name="link"
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