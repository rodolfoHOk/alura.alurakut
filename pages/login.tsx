import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/router'; // Hook do Next js
import nookies from 'nookies';

export default function Login() {
  const router = useRouter();
  const [githubUser, setGithubUser] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={(event: FormEvent) => {
            event.preventDefault();
            fetch('https://alurakut.vercel.app/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ githubUser: githubUser })
            }).then(async (response) => {
              const dados = await response.json();
              // https://alurakut-rodolfohok.vercel.app/api/auth
              // http://localhost:3000/api/auth
              fetch('https://alurakut-rodolfohok.vercel.app/api/auth', {
                headers: {
                  'Authorization': `Bearer ${dados.token}`
                }
              }).then(async (authResponse) => {
                const authDados = await authResponse.json();
                if (authDados.isAuthenticated) {
                  nookies.set(null, 'USER_TOKEN', dados.token, {
                    path: '/',
                    maxAge: 86400 * 7
                  });
                  router.push('/');
                } else {
                  setLoginError(authDados.message);
                }
              });
            });
          }}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input
              placeholder="Usuário"
              value={githubUser}
              onChange={(event) => setGithubUser(event.target.value)}
            />
            {
              githubUser.length === 0 &&
              <p style={{ marginBottom: '8px' }}>Preencha o campo usuário</p>
            }
            {
              loginError &&
              <p style={{ marginBottom: '8px', color: 'red' }}>{loginError}</p>
            }
            <button type="submit">
              Login
            </button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>
                  ENTRAR JÁ
                </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
}