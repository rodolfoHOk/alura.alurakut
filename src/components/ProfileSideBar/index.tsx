import Box from "../Box"
import { AlurakutProfileSidebarMenuDefault } from "../../lib/AlurakutCommons"

type ProfileSideBarProps = {
  githubUser: string;
  perfil: any;
}

export default function ProfileSideBar(props: ProfileSideBarProps) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} alt="imagem" style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      {
        props.perfil &&
        <div className="perfil">
          <p>{props.perfil.name}</p>
          <p>{props.perfil.email}</p>
          <p>{props.perfil.company}</p>
          <p>{props.perfil.location}</p>
        </div>
      }
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}
