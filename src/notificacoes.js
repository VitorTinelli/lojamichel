import { useEffect, useState } from 'react'
import Header from './modules/header'
import Footer from './modules/footer'
import supabase from './supabase'
import ReactModal from 'react-modal'

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [anyChange, setAnyChange] = useState(false)
  const [selectedAviso, setSelectedAviso] = useState([])

  ReactModal.setAppElement('#root')

  useEffect(() => {
    const fetchNotificacoes = async () => {
      const { data, error } = await supabase
        .from('avisos')
        .select('*')
      if (error) {
        console.error(error)
      } else {
        setNotificacoes(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at) ))
      }
    }
    fetchNotificacoes()
    document.title = 'Notificacoes - Loja Michel'
  }
    , [anyChange, selectedAviso])

  const abrirNotificacao = async (aviso) => {
    setModalIsOpen(true)
    try {
      const { error } = await supabase
        .from('avisos')
        .update({ status: true })
        .select('id, aviso, content, link, created_at')
        .eq('id', aviso)
      if (error) {
        console.error(error)
      } else {
        setAnyChange(!anyChange)
        fetchSelectedAviso(aviso)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const fetchSelectedAviso = async (aviso) => {
    const { data, error } = await supabase
      .from('avisos')
      .select('id, aviso, content, link, created_at')
      .eq('id', aviso)
    setSelectedAviso(data)
    if (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <>
        <Header />
        <main>
          <h2 className="page-title">Notificacoes</h2>

          <table>
            <thead>
              <tr>
                <th>
                  Notificacao
                </th>
                <th>
                  Data
                </th>
                <th>
                  Status
                </th>
                <th>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {notificacoes.map((notificacao) => (
                <tr key={notificacao.id}>
                  <td>
                    {notificacao.aviso}
                  </td>
                  <td>
                    {new Date(notificacao.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    {notificacao.status ? 'Lida' : 'Não lida'}
                  </td>
                  <td>
                    <div className='buttonContainer'>
                      <button className='buttonActionNew' onClick={() => abrirNotificacao(notificacao.id)}>
                        Ler
                      </button>
                      <ReactModal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                      >
                        <div className='modal-container'>
                          <h4>{selectedAviso[0]?.aviso} ({new Date(selectedAviso[0]?.created_at).toLocaleDateString()})</h4>
                          <p className='notificacao-content'>{selectedAviso[0]?.content}</p>
                          <a className='nitificacao-content'>{selectedAviso[0]?.link}</a>
                          <button onClick={() => setModalIsOpen(false)} className='buttonActionCancel'>Fechar</button>
                        </div>
                      </ReactModal>
                      <button className='buttonActionCancel' onClick={
                        async () => {
                          const { error } = await supabase
                            .from('avisos')
                            .delete()
                            .eq('id', notificacao.id)
                          if (error) {
                            console.error(error)
                          } else {
                            setAnyChange(!anyChange)
                          }
                        }
                      }>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        <Footer />
      </>
    </main>
  )
}