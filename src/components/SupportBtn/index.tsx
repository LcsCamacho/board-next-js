
import styles from './styles.module.scss'
import Link from 'next/link'

export function SupportBtn() {
    return(
        <div className={styles.donateContainer}>
            <Link href="/donate">
                <button>Apoiar</button>
            </Link>
        </div>
    )
}