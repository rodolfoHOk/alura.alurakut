import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';

type AuthResponse = {
  isAuthenticated: boolean;
  message?: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<AuthResponse>) => {
  const token = (req.headers.authorization)?.substring(7,);

  if (token) {
    const tokenDecodificado: any = jwt.decode(token);
    const expirado = (tokenDecodificado.exp * 1000) <= Date.now();
    console.log(expirado);
    if (expirado) {
      res.json({ isAuthenticated: false, message: 'validade do token expirado' });
      return;
    }
    const githubUser = tokenDecodificado.githubUser;
    const response = await fetch(`https://api.github.com/users/${githubUser}`);
    if (response.status === 404) {
      res.json({ isAuthenticated: false, message: 'usuário do github não encontrado' });
      return;
    }
  }
  res.json({ isAuthenticated: true });
}
