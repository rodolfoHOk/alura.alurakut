import { ProfileRelationsBoxWrapper } from "../ProfileRelations"

type RelationsGroupProps = {
  title: string;
  list: any[];
}

export default function RelationsGroup(props: RelationsGroupProps) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">{props.title} ({props.list.length})</h2>
      {
        props.title === 'Comunidades' ?
          (
            <ul>
              {props.list.slice(0 - 6).map((itemList) => {
                return (
                  <li key={itemList.id}>
                    <a href={itemList.link}>
                      <img src={itemList.image} />
                      <span>{itemList.title}</span>
                    </a>
                  </li >
                );
              })}
            </ul>
          ) :
          (
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
