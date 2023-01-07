

import Head from 'next/head'
import styles from './styles.module.scss'
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi'
import { SupportBtn } from '../../components/SupportBtn'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import Link from 'next/link'
import React, { useState, FormEvent } from 'react'

import { format, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'


import firebase from '../../services/firebaseConnection'

type TaskList = {
    id: string;
    created: string | Date;
    createdFormated?: string;
    tarefa: string;
    userId: string;
    nome: string;
}

interface boardProps {
    user: {
        id: string;
        nome: string;
        vip: boolean;
        lastDonate: string | Date;
    }
    data: string;
}

export default function Board({ user, data }: boardProps) {
    const [input, setInput] = useState('')
    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data))
    const [taskEdit, setTaskEdit] = useState<TaskList | null>(null)

    async function handleAddTask(e: FormEvent) {
        e.preventDefault()
        if (input === '') {
            alert('preencha alguma tarefa')
            return
        }

        if (taskEdit) {
            await firebase.firestore().collection('Tarefas')
                .doc(taskEdit.id)
                .update({
                    tarefa: input
                })
                .then(() => {
                    let data = taskList
                    let taskIndex = taskList.findIndex(item => item.id === taskEdit.id)
                    data[taskIndex].tarefa = input

                    setTaskList(data)
                    setTaskEdit(null)
                    setInput('')
                })
                .catch((err:ResponseType) => console.log("erro"))
            return
        }

        await firebase.firestore().collection('Tarefas')
            .add({
                created: new Date(),
                tarefa: input,
                userId: user.id,
                nome: user.nome,
            })
            .then((doc:any) => {
                let data = {
                    id: doc.id,
                    created: new Date(),
                    createdFormated: format(new Date(), 'dd MMMM yyyy'),
                    tarefa: input,
                    userId: user.id,
                    nome: user.nome
                }

                setTaskList([...taskList, data])
                setInput('')
            })
            .catch((err:ResponseType) => {
                console.log('erro: ', err)
            })
    }

    async function handleDelete(id: string) {
        await firebase.firestore().collection('Tarefas').doc(id)
            .delete()
            .then(() => {
                alert('Deletado com sucesso')
                let taskAtt = taskList.filter(item => {
                    return (item.id !== id)
                })

                setTaskList(taskAtt)
            })
            .catch((err: ResponseType) => console.log('Erro', err))

    }

    function handleEditTask(task: TaskList) {
        setTaskEdit(task)
        setInput(task.tarefa)
        console.log(taskEdit)
    }

    function handleCancelEdit() {
        setInput('')
        setTaskEdit(null)
    }

    return (
        <>
            <Head>
                <title>Gerenciador de tarefas</title>
            </Head>
            <main className={styles.container}>
                {taskEdit && (
                    <span className={styles.warnText}>
                        <button onClick={() => handleCancelEdit}>
                            <FiX size={30} color="#FF3636" />
                        </button>
                        Voce esta editando uma tarefa
                    </span>
                )}
                <form onSubmit={handleAddTask}>
                    <input type="text"
                        placeholder="Digite sua tarefa...."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit">
                        <FiPlus size={25} color="#17181f" />
                    </button>
                </form>
                <h1>Voce tem {taskList.length} {taskList.length === 1 ? "Tarefa!" : "Tarefas!"}</h1>

                <section>
                    {taskList.map((task, i) => (
                        <article className={styles.taskList} key={i}>
                            <Link href={`/board/${task.id}`}>
                                <p>{task.tarefa}</p>
                            </Link>

                            <div className={styles.actions}>
                                <div>
                                    <div>
                                        <FiCalendar size={20} color="#FFb800" />
                                        <time>{task.createdFormated}</time>
                                    </div>
                                    {user.vip && (
                                        <button onClick={() => handleEditTask(task)}>
                                            <FiEdit2 size={20} color="#fff" />
                                            <span>Editar</span>
                                        </button>
                                    )}
                                </div>

                                <button onClick={() => handleDelete(task.id)}>
                                    <FiTrash size={20} color="#FF3636" />
                                    <span>Excluir</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>

            {user.vip && (
                <div className={styles.vipContainer}>
                    <h3>Obrigado por apoiar esse projeto!!</h3>
                    <div>
                        <FiClock size={28} color="#fff" />
                        <time>
                            Última doação foi {formatDistance(new Date(user.lastDonate), new Date(), {locale: ptBR})}
                        </time>
                    </div>
                </div>
            )}

            <SupportBtn />

        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }


    const tasks = await firebase.firestore()
        .collection('Tarefas')
        .where('userId', '==', session?.id)
        .orderBy('created', 'asc')
        .get()
    const data = JSON.stringify(tasks.docs.map((u:any) => {
        return {
            id: u.id,
            createdFormated: format(u.data().created.toDate(), 'dd MMMM yyyy'),
            ...u.data(),
        }
    }))

    const user = {
        nome: session?.user?.name,
        id: session?.id,
        vip: session?.vip,
        lastDonate: session?.lastDonate,
    }

    return {
        props: {
            user,
            data
        }
    }
}