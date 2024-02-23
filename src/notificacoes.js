import { useEffect, useState } from 'react'
import Header from './modules/header'
import Footer from './modules/footer'
import supabase from './supabase'
import ReactModal from 'react-modal'

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [anyChange, setAnyChange] = useState(false)

  ReactModal.setAppElement('#root')

  useEffect(() => {
    const fetchNotificacoes = async () => {
      const { data, error } = await supabase
        .from('avisos')
        .select('*')
      if (error) {
        console.error(error)
      } else {
        setNotificacoes(data)
      }
    }
    fetchNotificacoes()
    document.title = 'Notificacoes - Loja Michel'
  }
    , [anyChange])

  const abrirNotificacao = async (aviso) => {
    setModalIsOpen(true)
    try {
      const { data, error } = await supabase
        .from('avisos')
        .update({ status: true })
        .eq('id', aviso)
      if (error) {
        console.error(error)
      } else {
        setAnyChange(!anyChange)
      }
    } catch (error) {
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
                          <h4>{notificacao.aviso} ({new Date(notificacao.created_at).toLocaleDateString()})</h4>
                          <p className='notificacao-content'> {notificacao.content}</p>
                          <p> {notificacao.link}</p>
                          <button onClick={() => setModalIsOpen(false)} className='buttonActionCancel'>Fechar</button>
                        </div>
                      </ReactModal>
                      <button className='buttonActionCancel'>
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