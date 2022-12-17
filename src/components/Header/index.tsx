import Link from 'next/link'
import Image from 'next/image'
import styles from './styles.module.scss'
import { GitButton } from '../GitButton'
import { useSession } from 'next-auth/client'
import logo from "../../../public/images/logo.svg"


export function Header() {
    const [session] = useSession();

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <Image src={logo} alt="Logo" />
                </Link>
                <nav>
                    <Link href="/">
                        <>Home</>
                    </Link>
                    {
                        session ?
                            <Link href="/board">
                                <>Meu Board</>
                            </Link> : <></>
                    }
                </nav>
                <GitButton />
            </div>
        </header>
    )
}