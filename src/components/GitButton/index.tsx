import { signIn, signOut, useSession } from 'next-auth/client'
import Image from 'next/image'
import styles from './styles.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export function GitButton() {

    const [session] = useSession();

    return session ? (
        <button
            type='button'
            className={styles.GitButton}
            onClick={ () => signOut() }
        >
            <Image src={String(session.user?.image)} alt="Foto do usuário"
            width={35} height={35} />
            <FiX color="#737380" className={styles.closeIcon}/>
            Olá {session.user?.name}
        </button>
    ) : (
        <button
            type='button'
            className={styles.GitButton}
            onClick={ () => signIn('github') }
        >
            <FaGithub color="#FFB800"/>
            Entrar com GitHub
        </button>
    )
}