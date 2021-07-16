import { NextApiRequest, NextApiResponse } from "next";
//@ts-ignore
import { SiteClient } from 'datocms-client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const client = new SiteClient(process.env.NEXT_PUBLIC_DATO_CMS_FULL_TOKEN);
    const registroCriado = await client.items.create({
      itemType: '972385',
      ...req.body,
    });

    res.status(201).json({
      registroCriado: registroCriado
    });
    return;
  }

  let dados = [];
  fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DATO_CMS_READ_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'query': `query {
        allScraps {
          id
          message
          user
          _createdAt
        }
      }`
    })
  }).then(async (response) => {
    dados = await response.json();
    res.status(200).json(dados.data.allScraps);
  });
}