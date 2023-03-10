import styles from './styles.module.scss'
import Image from 'next/image'
import { useState } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import firebase from '../../services/firebaseConnection'
import { PayPalButtons } from '@paypal/react-paypal-js'
import imgRocket from "../../../public/images/rocket.svg"


interface DonateProps {
    user: {
        nome: string;
        id: string;
        image: string;

    }
}
//AV-Q6SfTTNwxE1UFbr0RDxvUSJ9zjcTWbqrbxmdee4tD_7qQX8ze26E82iQVoV4F9_hXAWAeQIC8Gekt
//<script src="https://www.paypal.com/sdk/js?client-id=CLIENT_ID"></script>
export default function Donate({ user }: DonateProps) {
    const [vip, setVip] = useState(false)
    async function handleSaveDonate() {
        await firebase.firestore().collection('users')
            .doc(user.id)
            .set({
                donate: true,
                lastDonate: new Date(),
                image: user.image
            })
            .then(() => {
                setVip(true)
            })
    }

    return (
        <>
            <Head>
                <title>Ajude a plataforma board ficar online!</title>
            </Head>
            <main className={styles.container}>
                <Image className={styles.rocket} src={imgRocket} alt="seja apoiador" />
                {
                    vip && (
                        <div className={styles.vip}>
                            <Image width={50} height={50}
                             src={user.image} alt="avatar" />
                            <span>Parabéns voce é um novo apoiador!</span>
                        </div>

                )
                }

                <h1>Seja um apoiador deste projeto</h1>
                <h3>Contribua com apenas <span>R$1,00 real</span></h3>

                <strong>Apareça na nossa home, tenha funcionalidades exclusivas</strong>

                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: "1"
                                }
                            }]
                        })
                    }}
                    onApprove={(data, actions):any => {
                        return actions.order?.capture().then(function (details) {
                            console.log('Compra aprovada: ' + details.payer.name?.given_name);
                            handleSaveDonate();
                        })
                    }} />
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session?.id) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const user = {
        nome: session?.user?.name,
        id: session?.id,
        image: session?.user?.image
    }

    return {
        props: {
            user
        }
    }
}