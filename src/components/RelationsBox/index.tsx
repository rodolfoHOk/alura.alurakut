import { ProfileRelationsBoxWrapper } from "../ProfileRelations"

type RelationsBoxProps = {
  title: string;
  list: any[];
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
                <li key={itemList}>
                  <a href={`/ users / ${itemList}`}>
                    <img src={`https://github.com/${itemList}.png`} />
                    <span>{itemList}</span>
                  </a>
                </li >
              );
            })}
          </ul>
        )
      }
    </ProfileRelationsBoxWrapper >
  )
}
