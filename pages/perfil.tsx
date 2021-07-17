import { GetServerSideProps } from 'next';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AlurakutMenu } from '../src/lib/AlurakutCommons';
import MainGrid from '../src/components/MainGrid';
import ProfileSideBar from '../src/components/ProfileSideBar';
import Box from '../src/components/Box';
import RelationsBoxPerfil from "../src/components/RelationsBoxPerfil";

type PerfilProps = {
  githubUser: string;
}

export default function PerfilPage({ githubUser }: PerfilProps) {
  const [dadosPerfil, setDadosPerfil] = useState<any>({});
  const [seguindo, setSeguindo] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}`)
      .then(async (response) => {
        const responseData = await response.json();
        setDadosPerfil(responseData);
      });
    fetch(`https://api.github.com/users/${githubUser}/following`)
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function (respostaCompleta) {
        setSeguindo(respostaCompleta);
      });
  }, []);

  function logout() {
    nookies.destroy(null, 'USER_TOKEN');
    router.push('/login');
  }

  return <>
    <AlurakutMenu githubUser={githubUser} logout={logout} />
    <MainGrid>
      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
        <ProfileSideBar githubUser={githubUser} perfil={dadosPerfil} />
      </div>
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
        <Box>
          <div className="image">
            <h1 className="subtitle">Perfil</h1>
            <img src={`https://github.com/${githubUser}.png`} alt="foto perfil" />
          </div>
          <table>
            <tr>
              <td>Nome:</td>
              <td>{dadosPerfil.name}</td>
            </tr>
            <tr>
              <td>Github Login: </td>
              <td>{dadosPerfil.login}</td>
            </tr>
            <tr>
              <td>Github url: </td>
              <td><a href={dadosPerfil.html_url}>{dadosPerfil.html_url}</a></td>
            </tr>
            <tr>
              <td>Companhia: </td>
              <td>{dadosPerfil.company}</td>
            </tr>
            <tr>
              <td>Local: </td>
              <td>{dadosPerfil.location}</td>
            </tr>
            <tr>
              <td>Biografia: </td>
              <td>{dadosPerfil.bio}</td>
            </tr>
          </table>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
        <RelationsBoxPerfil title="Seguindo Perfil" list={seguindo} linkUrl="/seguindo" />
      </div >
    </MainGrid>
  </>
}

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