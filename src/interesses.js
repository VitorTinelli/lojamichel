import Header from "./modules/header"
import Footer from "./modules/footer"
import { useEffect, useState } from "react";
import supabase from "./supabase.js"
import ReactModal from "react-modal";

export default function Interesses() {
  const [interesses, setInteresses] = useState([])
  const [anyChange, setAnyChange] = useState(false)
  const [modalChangeIsOpen, setModalChangeIsOpen] = useState(false)

  const [selectedChange, setSelectedChange] = useState("")
  const [changeInteresse, setChangeInteresse] = useState("")

  const editarInteresse = async (interesse) => {
    setSelectedChange(interesse)
    setChangeInteresse(interesse.interesse);
    setModalChangeIsOpen(true)
  }
  ReactModal.setAppElement('#root');

  useEffect(() => {
    const fetchInteresses = async () => {
      try {
        const { data, error } = await supabase
          .from("interesses")
          .select("id, clienteID, interesse");
        if (error) {
          throw error;
        }
        const interesseComNome = await Promise.all(
          data.map(async interesse => {
            const { data: clienteData, error: clienteError } = await supabase
              .from("clientes")
              .select("nome")
              .eq("id", interesse.clienteID);
            if (clienteError) {
              throw clienteError;
            }
            return { ...interesse, clienteNome: clienteData[0].nome };
          })
        );
        setInteresses(interesseComNome.reverse());
      } catch (error) {
        console.error("Erro ao buscar interesses:", error.message);
      }
    };
    fetchInteresses();
  }, [anyChange]);

  return (
    <main>
      <>
        <Header />
        <main>
          <h1 className="titulo">Interesses:</h1>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Interesse</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {interesses.map((interesse) => (
                <tr key={interesse.id}>
                  <td>
                    {interesse.clienteNome}
                  </td>
                  <td>
                    {interesse.interesse}
                  </td>
                  <td>
                    <div className="buttonContainer">
                      <button className="buttonActionChange" onClick={() => editarInteresse(interesse)}>Editar</button>
                      <ReactModal isOpen={modalChangeIsOpen} onRequestClose={() => setModalChangeIsOpen(false)}>
                        <div className="modal-container">
                            <div>
                              <p className="tittle">Nome</p>
                              <input
                                type="text"
                                name="interesse"
                                id="interesse"
                                placeholder="Interesse"
                                required
                                value={changeInteresse !== null && changeInteresse !== undefined ? changeInteresse : (selectedChange && selectedChange.interesse)}
                                onChange={(e) => setChangeInteresse(e.target.value)}
                                className="input"
                              />
                            </div>
                            <p className="subtitle">(Atual: {selectedChange.interesse})</p>

                            <div className="buttonsSpacing">
                              <button className="buttonActionNew" onClick={async() => 
                              await supabase
                                .from('interesses')
                                .update({ interesse: changeInteresse })
                                .eq('id', selectedChange.id)
                                .then(() => {
                                  setAnyChange(!anyChange)
                                  setModalChangeIsOpen(!modalChangeIsOpen)
                                })
                              }>Salvar</button>
                              <button className="buttonActionCancel" onClick={() => setModalChangeIsOpen(!modalChangeIsOpen)}>Sair</button>
                            </div>
                          </div>
                      </ReactModal>
                      <button className="buttonActionCancel" onClick={async () => {
                        const confirmar = window.confirm(`Você realmente deseja excluir o interesse: ${interesse.interesse} 
                        \n Cliente: ${interesse.clienteNome}?`);
                        if (confirmar) {
                          await supabase
                            .from('interesses')
                            .delete()
                            .eq('id', interesse.id)
                        }
                        setAnyChange(!anyChange)
                      }}>Excluir</button>
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
