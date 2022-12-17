import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/styles.module.scss'
import { GetStaticProps } from 'next'
import firebase from '../services/firebaseConnection'
import {useState} from 'react'

import boardUser from '../../public/images/board-user.svg'

type Data = {
  id:string;
  donate:boolean;
  lastDonate: Date;
  image: string;
}

interface HomeProps{
  data:string;
}

export default function Home({data}:HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data))

  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={boardUser} alt="Ferramenta board" />

        <section className={styles.callToAction}>
          <h1>
            Primeiro projeto com <span>NextJS!</span>
          </h1>
          <p>
            <span> 100% Gratuita </span>
            e online
          </p>
        </section>
        {donaters.length !== 0 && <h3>Apoiadores:</h3>}
        <div className={styles.donaters}>
          {donaters.map( (item,i) => (
            <Image key={i} src={item.image} alt="usuario" 
            width={50} height={50} />

          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const donaters = await firebase.firestore().collection('users').get();

  const data = JSON.stringify(donaters.docs.map( u => {
    return{
      id:u.id,
      ...u.data(),
    } 
  }))

  return {
    props: {
      data
    },
    revalidate: 60 * 60
  }
}