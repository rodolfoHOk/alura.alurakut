import Link from "next/link";
import { ProfileRelationsBoxWrapper } from "../ProfileRelations"

type RelationsBoxProps = {
  title: string;
  list: any[];
  linkUrl: string;
}

export default function RelationsBox(props: RelationsBoxProps) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">{props.title} ({props.list.length})</h2>
      {
        props.title === 'Comunidades' ? (
          <ul>
            {props.list.slice(0 - 6).map((itemList) => {
              return (
                <li key={itemList.id}>
                  <a href={itemList.url}>
                    <img src={itemList.imageUrl} />
                    <span>{itemList.title}</span>
                  </a>
                </li >
              );
            })}
          </ul>
        ) : props.title === 'Seguindo' ? (
          <ul>
            {props.list.slice(0 - 6).map((itemList) => {
              return (
                <li key={itemList.id}>
                  <a href={itemList.html_url}>
                    <img src={itemList.avatar_url} />
                    <span>{itemList.login}</span>
                  </a>
                </li >
              );
            })}
          </ul>
        ) : (
          <ul>
            {props.list.slice(0 - 6).map((itemList) => {
              return (
                <li key={itemList.id}>
                  <a href={`/users/${itemList.githubUser}`}>
                    <img src={`https://github.com/${itemList.githubUser}.png`} />
                    <span>{itemList.githubUser}</span>
                  </a>
                </li >
              );
            })}
          </ul>
        )
      }
      <hr />
      <Link href={props.linkUrl}>
        <a className="boxLink">Ver todos</a>
      </Link>
    </ProfileRelationsBoxWrapper >
  )
}
