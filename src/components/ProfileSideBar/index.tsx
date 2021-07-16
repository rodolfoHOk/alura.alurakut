import Box from "../Box"
import { AlurakutProfileSidebarMenuDefault } from "../../lib/AlurakutCommons"

type Perfil = {
  id?: string;
  name: string;
  gender: string;
  localization: string;
  githubUser: string;
}

type ProfileSideBarProps = {
  githubUser: string;
  perfil: Perfil | undefined;
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
          <p>{props.perfil.gender}</p>
          <p>{props.perfil.localization}</p>
        </div>
      }
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}
