import { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import { SiteClient } from 'datocms-client';


export default async function recebedorDeRequests(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const TOKEN = process.env.NEXT_PUBLIC_DATO_CMS_FULL_TOKEN;
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "967474", // model ID de community criado pelo Dato CMS
      ...req.body,
      // title: "Comunidade de Teste",
      // imageUrl: "https://picsum.photos/200/300",
      // url: "/comunidades/8",
    });
    //console.log(registroCriado);

    res.json({
      //dados: 'alguma coisa',
      registroCriado: registroCriado,
    });
    return;
  }

  res.status(404).json({
    message: 'Somente POST por enquanto'
  });
}