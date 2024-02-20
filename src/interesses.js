import Header from "./modules/header"
import Footer from "./modules/footer"
import { useEffect, useState } from "react";
import supabase from "./supabase.js"
import ReactModal from "react-modal";

export default function Interesses() {
  const [interesses, setInteresses] = useState([])
  const [anyChange, setAnyChange] = useState(false)
  const [search, setSearch] = useState("")
  const [clientes, setClientes] = useState([])
  //modal
  const [modalChangeIsOpen, setModalChangeIsOpen] = useState(false)
  const [isModalNewOpen, setIsModalNewOpen] = useState(false)

  const [selectedChange, setSelectedChange] = useState("")
  const [changeInteresse, setChangeInteresse] = useState("")
  const [newInteresse, setNewInteresse] = useState("")
  const [newCliente, setNewCliente] = useState("")

  const handleSearch = async () => {
    try {
      const { data, error } = await supabase
        .from("interesses")
        .select("id, clienteID, interesse")
        .ilike("interesse", `%${search}%`);
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
  }

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
    const fetchClientes = async () => {
      try {
        const { data, error } = await supabase
          .from("clientes")
          .select("id, nome");
        if (error) {
          throw error;
        }
        setClientes(data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error.message);
      }
    };
    fetchClientes();
    fetchInteresses();
  }, [anyChange]);

  return (
    <main>
      <>
        <Header />
        <main>
          <div className="page-title">
            <h1 className="titulo">Interesses:</h1>
            <div className="row-buttons">
              <input type="text" id="search" placeholder="Categoria" className="input" value={search} onChange={(e) => setSearch(e.target.value)} onKeyUpCapture={handleSearch}/>
              <button className="buttonActionNew" onClick={() => setIsModalNewOpen(true)}>Novo Interesse</button>
              <ReactModal onRequestClose={() => setIsModalNewOpen(false)} isOpen={isModalNewOpen}>
                <div className="modal-container">
                  <div>
                    <p className="tittle">Cliente</p>
                    <select name="cliente" id="cliente" value={newCliente} onChange={(e) => setNewCliente(e.target.value)} className="input">
                      <option value="" disabled>Selecione um cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                      ))
                      }
                    </select>

                    <p className="tittle">Interesse</p>
                    <input
                      type="text"
                      name="interesse"
                      id="interesse"
                      placeholder="Interesse"
                      required
                      value={newInteresse}
                      onChange={(e) => setNewInteresse(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="buttonsSpacing">
                    <button className="buttonActionNew" onClick={async () => {
                      await supabase
                        .from('interesses')
                        .insert([{ clienteID: newCliente, interesse: newInteresse.trim().toLowerCase() }])
                        .then(() => {
                          setAnyChange(!anyChange)
                          setIsModalNewOpen(!isModalNewOpen)
                        })
                    }}>Salvar</button>
                    <button className="buttonActionCancel" onClick={() => setIsModalNewOpen(!isModalNewOpen)}>Sair</button>
                  </div>
                </div>
              </ReactModal>
            </div>
          </div>
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
                            <button className="buttonActionNew" onClick={async () =>
                              await supabase
                                .from('interesses')
                                .update({ interesse: changeInteresse.trim().toLocaleLowerCase() })
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
