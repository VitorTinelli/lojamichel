import Header from "./modules/header";
import Footer from "./modules/footer";
import supabase from "./supabase";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';
import { insertMaskInCpf } from "./mascaras/cpf.ts";
import { insertMaskInPhone } from "./mascaras/phone.ts";
import './index.css'



export default function Clientes() {

  //variaveis para coletar dados do banco e funcionamento da pagina
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalNewOpen, setIsModalNewOpen] = useState(false);
  const [isModalInteresseOpen, setIsModalInteresseOpen] = useState(false);
  const [clientes, setClientes] = useState([])
  const [interesses, setInteresses] = useState([])
  const [changeSort, setChangeSort] = useState(1)
  const [anyChange, setAnyChange] = useState(false)
  const [addInteresse, setAddInteresse] = useState(false);
  const [changeInteresseField, setChangeInteresseField] = useState(0)
  const [search, setSearch] = useState()
  const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

  //variaveis para adicionar novo cliente
  const [newCliente, setNewCliente] = useState("")
  const [newCPF, setNewCPF] = useState("")
  const [newRua, setNewRua] = useState("")
  const [newBairro, setNewBairro] = useState("")
  const [newCidade, setNewCidade] = useState("")
  const [newEstado, setNewEstado] = useState("")
  const [newNRES, setNewNRES] = useState("")
  const [newAP, setNewAP] = useState("")
  const [newCelular, setNewCelular] = useState("")
  const [newNascimento, setNewNascimento] = useState()
  const [newInteresse, setNewInteresse] = useState("")


  //variaveis para editar cliente
  const [selectedCliente, setSelectedCliente] = useState("");
  const [changeCliente, setChangeCliente] = useState("")
  const [changeCPF, setChangeCPF] = useState("")
  const [changeRua, setChangeRua] = useState("")
  const [changeBairro, setChangeBairro] = useState("")
  const [changeCidade, setChangeCidade] = useState("")
  const [changeEstado, setChangeEstado] = useState("")
  const [changeNRES, setChangeNRES] = useState("")
  const [changeAP, setChangeAP] = useState("")
  const [changeCelular, setChangeCelular] = useState("")
  const [changeNascimento, setChangeNascimento] = useState()
  const [changeInteresse, setChangeInteresse] = useState("")

  ReactModal.setAppElement('#root');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const { data, error } = await supabase
          .from("clientes")
          .select("id, nome, cpf, rua, bairro, cidade, estado, nres, ap, celular, aniversario");
        if (error) {
          throw error;
        }
        let sortedData;
        if (changeSort === 1) {
          sortedData = [...data].sort((a, b) => a.nome.localeCompare(b.nome));
        } else if (changeSort === 2) {
          sortedData = [...data].sort((a, b) => b.nome.localeCompare(a.nome));
        } else {
          sortedData = data;
        }
        setClientes(sortedData);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error.message);
      }
    };
    fetchClientes();
  }, [changeSort, anyChange]);

  const salvarBanco = async () => {
    const { error } = await supabase
      .from('clientes')
      .insert([{
        nome: newCliente.trim(),
        cpf: newCPF.trim(),
        rua: newRua.trim(),
        bairro: newBairro.trim(),
        cidade: newCidade.trim(),
        estado: newEstado.trim().toUpperCase(),
        nres: newNRES.trim(),
        ap: newAP.trim(),
        celular: newCelular.trim(),
        aniversario: newNascimento
      }
      ])
      .select()
    if (error) {
      console.log("Erro ao inserir clientes:", error.message)
    }
    
    setNewCliente("")
    setNewCPF("")
    setNewRua("")
    setNewBairro("")
    setNewCidade("")
    setNewEstado("")
    setNewNRES("")
    setNewAP("")
    setNewCelular("")
    setNewNascimento("")
    setAnyChange(!anyChange)
    setIsModalNewOpen(!isModalNewOpen)
  }

  const editarCliente = (cliente) => {
    setIsModalOpen(true)
    setSelectedCliente(cliente)
    setChangeCliente(cliente.nome);
    setChangeCPF(cliente.cpf);
    setChangeRua(cliente.rua);
    setChangeBairro(cliente.bairro);
    setChangeCidade(cliente.cidade);
    setChangeEstado(cliente.estado);
    setChangeNRES(cliente.nres);
    setChangeAP(cliente.ap);
    setChangeCelular(cliente.celular);
    setChangeNascimento(cliente.aniversario);
  }

  const handleAddInteresseClick = () => {
    setAddInteresse(true);
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const { data, error } = await supabase
          .from("clientes")
          .select("id, nome, cpf, rua, bairro, cidade, estado, nres, ap, celular, aniversario")
          .ilike('nome', `%${search}%`);
        if (error) {
          throw error;
        }
        setClientes(data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error.message);
      }
    }
  }

  const fetchInteresses = async (clienteId) => {
    try {
      const { data, error } = await supabase
        .from('interesses')
        .select('id, interesse')
        .eq('clienteID', clienteId);
      if (error) {
        throw error;
      }
      setInteresses(data.sort((a, b) => a.id - b.id));
      console.log(data)
    } catch (error) {
      console.error("Erro ao buscar interesses:", error.message);
      console.log("teste alteracao")
    }
  };

  const verInteresses = (cliente) => {
    setIsModalInteresseOpen(true);
    setSelectedCliente(cliente);
    fetchInteresses(cliente.id);
  };

  return (
    <main>
      <>
        <Header />
        <main>
          <div className="page-title">
            <h1 className="titulo">Clientes:</h1>
            <div className="row-buttons">
              <input type="text" id="search" placeholder="Pesquisar" className="input" value={search} onChange={(e) => setSearch(e.target.value)} onKeyUpCapture={handleSearch} maxLength={'1dvh'} />
                <button className="buttonActionNew" onClick={() => setIsModalNewOpen(true)}>Novo Cliente</button>
            </div>
          </div>
          <ReactModal isOpen={isModalNewOpen} onRequestClose={() => setIsModalNewOpen(false)}>
            <div className="modal-container">
              <div>
                <p className="tittle">Nome *</p>
                <input type="text" name="newCliente" id="newCliente" placeholder="Nome do Cliente"
                  required value={newCliente} onChange={(e) => setNewCliente(e.target.value)} className="input" />
              </div>

              <div>
                <p className="tittle">CPF *</p>
                <input type="text" name="newClienteCPF" id="newClienteCPF" placeholder="CPF"
                  required value={newCPF} onChange={(e) => setNewCPF(e.target.value)} className="input" />
              </div>

              <div>
                <p className="tittle">Logradouro</p>
                <input type="text" name="newClienteRua" id="newClienteRua" placeholder="Logradouro"
                  required value={newRua} onChange={(e) => setNewRua(e.target.value)} className="input" />
              </div>

              <div>
                <p className="tittle">Bairro</p>
                <input type="text" name="newClienteBairro" id="newClienteBairro" placeholder="Bairro"
                  required value={newBairro} onChange={(e) => setNewBairro(e.target.value)} className="input" />
              </div>

              <div>
                <p className="tittle">Cidade</p>
                <input type="text" name="newClienteCidade" id="newClienteCidade" placeholder="Cidade"
                  required value={newCidade} onChange={(e) => setNewCidade(e.target.value)} className="input" />
              </div>

              <div>
                <p className="tittle">Estado</p>
                <input type="text" name="newClienteEstado" id="newClienteEstado" placeholder="Estado"
                  required value={newEstado} onChange={(e) => setNewEstado(e.target.value)} className="input" />
              </div>

              <div>
                <p className="tittle">Numero Residência</p>
                <input type="number" name="newClienteNRES" id="newClienteNRES" placeholder="Numero Residência"
                  required value={newNRES} onChange={(e) => setNewNRES(e.target.value)} className="input" />
              </div>

              <div>
                <p className="tittle">Apartamento</p>
                <input type="number" name="newClienteAP" id="newClienteAP" placeholder="Apartamento"
                  required value={newAP} onChange={(e) => setNewAP(e.target.value)} className="input" />
              </div>

              <div>
                <p className="tittle">Celular *</p>
                <input type="text" name="newClienteCelular" id="newClienteCelular" placeholder="Celular"
                  required value={newCelular} onChange={(e) => setNewCelular(e.target.value)} className="input" />
              </div>
              <div>
                <p className="tittle">Nascimento</p>
                <input type="date" name="newClienteNascimento" id="newClienteNascimento" placeholder="Nascimento" required value={newNascimento}
                  onChange={(e) => setNewNascimento(e.target.value)} className="input" />
              </div>
              <div>
                <p className="subtitle">* Indica os campos obrigatórios.</p>
              </div>

              <div className="buttonsSpacing">
                <button className="buttonActionNew" onClick={() => salvarBanco()}>Adicionar</button>
                <button className="buttonActionCancel" onClick={() => setIsModalNewOpen(false)}>Sair</button>
              </div>
            </div>
          </ReactModal>

          <table>
            <thead>
              <tr>
                <th className='pointer' onClick={
                  () => setChangeSort(changeSort === 1 ? 2 : 1)
                }>Nome</th>
                <th>CPF</th>
                <th>Endereço</th>
                <th>Cidade</th>
                <th>Celular</th>
                <th>Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{insertMaskInCpf(cliente.cpf)}</td>
                  <td>{cliente.rua}, {cliente.nres} - {cliente.bairro} AP: {cliente.ap}</td>
                  <td>{cliente.cidade}, {cliente.estado}</td>
                  <td>{insertMaskInPhone(cliente.celular)}</td>
                  <td>{formatter.format(new Date(cliente.aniversario))}</td>
                  <td>
                    <div className="buttonContainer">
                      <button onClick={() => verInteresses(cliente)} className="buttonActionNew">Interesses</button>
                      <ReactModal isOpen={isModalInteresseOpen} onRequestClose={() => setIsModalInteresseOpen(false)} >
                        <div className="modal-container">
                          <table>
                            <thead>
                              <tr>
                                <th>
                                  Id
                                </th>
                                <th>
                                  Interesse do Cliente: {selectedCliente.nome}
                                </th>
                                <th>
                                  Ações
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {interesses.map((interesse) => (
                                <tr key={interesse.id}>
                                  <td>{interesse.id}</td>
                                  <td onClick={() => { setChangeInteresseField(interesse.id); setChangeInteresse(interesse.interesse) }}>{changeInteresseField === interesse.id ? (<input
                                    type="text"
                                    onBlur={() => setChangeInteresseField(0)}
                                    className="input"
                                    placeholder="Alterar Interesse"
                                    value={changeInteresse !== null && changeInteresse !== undefined ? changeInteresse : interesse.interesse}
                                    onChange={(e) => setChangeInteresse(e.target.value)}
                                    onKeyDown={async (e) => {
                                      if (e.key === 'Enter') {
                                        await supabase
                                          .from('interesses')
                                          .update([{ interesse: changeInteresse.toLowerCase().trim()}])
                                          .eq('id', interesse.id)
                                        setAnyChange(!anyChange);
                                        setChangeInteresseField(0);
                                        fetchInteresses(selectedCliente.id)
                                      }
                                    }}
                                  />
                                  ) : (
                                    interesse.interesse
                                  )}</td>
                                  <td>
                                    <button className="buttonActionCancel" onClick={async () => {
                                      const confirmar = window.confirm(`Você realmente deseja excluir o interesse: ${interesse.interesse}?`);
                                      if (confirmar) {
                                        await supabase
                                          .from('interesses')
                                          .delete()
                                          .eq('id', interesse.id)
                                        setAnyChange(!anyChange);
                                        fetchInteresses(selectedCliente.id);
                                      }
                                    }}>Excluir</button>
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td>+</td>
                                <td onClick={handleAddInteresseClick}>
                                  {addInteresse ? (
                                    <input
                                      type="text"
                                      onBlur={() => setAddInteresse(false)}
                                      className="input"
                                      placeholder="Adicionar Interesse"
                                      value={newInteresse}
                                      onChange={(e) => setNewInteresse(e.target.value)}
                                      onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                          await supabase
                                            .from('interesses')
                                            .insert([{ clienteID: selectedCliente.id, interesse: e.target.value.trim().toLowerCase() }]);
                                          setAnyChange(!anyChange);
                                          setAddInteresse(false);
                                          fetchInteresses(selectedCliente.id);
                                        }
                                      }}
                                    />
                                  ) : (
                                    "Adicionar Interesse"
                                  )}
                                </td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="buttonsSpacing">
                            <button className="buttonActionCancel" onClick={() => setIsModalInteresseOpen(false)}>Sair</button>
                          </div>
                        </div>
                      </ReactModal>
                      <button className="buttonActionChange" onClick={() => editarCliente(cliente)} >Alterar</button>

                      <ReactModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                        <div className="modal-container">
                          <div>
                            <p className="tittle">Nome</p>
                            <input
                              type="text"
                              name="clientes"
                              id="clientes"
                              placeholder="cliente"
                              required
                              value={changeCliente !== null && changeCliente !== undefined && changeCliente !== "" ? changeCliente : ""}
                              onChange={(e) => setChangeCliente(e.target.value)}
                              className="input"
                            />                          </div>
                          <p className="subtitle">(Atual: {selectedCliente.nome})</p>

                          <div className="row-text">
                            <p className="tittle">CPF</p>
                            <p className="tittle">Nascimento</p>
                          </div>
                          <div className="row">
                            <input
                              type="text"
                              name="CPF"
                              id="CPF"
                              placeholder="CPF"
                              required
                              value={changeCPF !== null && changeCPF !== undefined && changeCPF !== "" ? changeCPF : ""}
                              onChange={(e) => setChangeCPF(e.target.value)}
                              className="input"
                            />
                            <input
                              type="date"
                              name="aniversario"
                              id='aniversario'
                              placeholder="Nascimento"
                              required
                              value={changeNascimento !== null && changeNascimento !== undefined ? changeNascimento : ""}
                              onChange={(e) => setChangeNascimento(e.target.value)}
                              className="input"
                            />
                          </div>
                          <p className="subtitle">(Atual: {selectedCliente.cpf} / {(selectedCliente && selectedCliente.aniversario) ? formatter.format(new Date(selectedCliente.aniversario)) : ''})</p>
                          <div className="row-text">
                            <p className="tittle">Logradouro</p>
                            <p className="tittle">Numero</p>
                          </div>
                          <div className="row">
                            <input
                              type="text"
                              name="rua"
                              id="rua"
                              placeholder="Rua"
                              required
                              value={changeRua !== null && changeRua !== undefined && changeRua !== ""? changeRua : ""}
                              onChange={(e) => setChangeRua(e.target.value)}
                              className="input"
                            />
                            <input
                              type="number"
                              name="numero"
                              id="numero"
                              placeholder="Numero da Residência"
                              required
                              value={changeNRES !== null && changeNRES !== undefined && changeNRES !== "" ? changeNRES : ""}
                              onChange={(e) => setChangeNRES(e.target.value)}
                              className="input"
                            />
                          </div>
                          <p className="subtitle">(Atual: {selectedCliente.rua},  {selectedCliente.nres})</p>

                          <div className="row-text">
                            <p className="tittle">Bairro</p>
                            <p className="tittle">Apartamento</p>
                          </div>

                          <div className="row">
                            <input
                              type="text"
                              name="Bairro"
                              id="Bairro"
                              placeholder="Bairro"
                              required
                              value={changeBairro !== null && changeBairro !== undefined && changeBairro !== "" ? changeBairro : ""}
                              onChange={(e) => setChangeBairro(e.target.value)}
                              className="input"
                            />
                            <input
                              type="number"
                              name="AP"
                              id="AP"
                              placeholder="AP"
                              required
                              value={changeAP !== null && changeAP !== undefined && changeAP !== "" ? changeAP : ""}
                              onChange={(e) => setChangeAP(e.target.value)}
                              className="input"
                            />
                          </div>
                          <p className="subtitle">(Atual: {selectedCliente.bairro}, AP:  {selectedCliente.ap})</p>

                          <div>
                            <p className="tittle">Cidade</p>
                            <input
                              type="text"
                              name="cidade"
                              id="cidade"
                              placeholder="cidade"
                              required
                              value={changeCidade !== null && changeCidade !== undefined && changeCidade !== "" ? changeCidade : ""}
                              onChange={(e) => setChangeCidade(e.target.value)}
                              className="input"
                            />
                          </div>
                          <p className="subtitle">(Atual: {selectedCliente.cidade})</p>

                          <div>
                            <p className="tittle">Estado</p>
                            <input
                              type="text"
                              name="Estado"
                              id="Estado"
                              placeholder="Estado"
                              required
                              value={changeEstado !== null && changeEstado !== undefined && changeEstado !== ""? changeEstado : ""}
                              onChange={(e) => setChangeEstado(e.target.value.toUpperCase())}
                              className="input"
                            />
                          </div>
                          <p className="subtitle">(Atual: {selectedCliente.estado})</p>
                          <div>
                            <p className="tittle">Celular</p>
                            <input
                              type="text"
                              name="Celular"
                              id="Celular"
                              placeholder="Celular"
                              value={changeCelular !== null && changeCelular !== undefined &&changeCelular !== "" ? changeCelular : ""}
                              onChange={(e) => setChangeCelular(e.target.value)}
                              className="input"
                            />
                          </div>
                          <p className="subtitle">(Atual: {selectedCliente.celular})</p>
                          <div className="buttonsSpacing">
                            <button className="buttonActionNew" onClick={async () => {
                              try {
                                await supabase
                                  .from("clientes")
                                  .update({
                                    nome: changeCliente.trim(),
                                    cpf: changeCPF.trim(),
                                    rua: changeRua.trim(),
                                    bairro: changeBairro.trim(),
                                    cidade: changeCidade.trim(),
                                    estado: changeEstado.trim(),
                                    nres: changeNRES.trim(),
                                    ap: changeAP.trim(),
                                    celular: changeCelular.trim(),
                                    aniversario: changeNascimento
                                  })
                                  .eq("id", selectedCliente.id);
                              } catch (error) {
                                console.error(error)
                              }
                              setAnyChange(!anyChange)
                              setIsModalOpen(false);
                              setChangeCliente(); setChangeCPF(); setChangeRua(); setChangeBairro(); setChangeCidade(); setChangeEstado(); setChangeNRES(); setChangeAP(); setChangeCelular(); setChangeNascimento(); setChangeInteresse();
                            }}> Salvar</button>
                            <button className="buttonActionChange" onClick={async () => {
                              const confirmar = window.confirm(`Você realmente deseja excluir o cliente: ${selectedCliente.nome}?`);
                              if (confirmar) {
                                await supabase
                                  .from('clientes')
                                  .delete()
                                  .eq('id', selectedCliente.id)
                                setAnyChange(!anyChange)
                                setIsModalOpen(false)
                              }
                            }}>Excluir</button>
                            <button className="buttonActionCancel" onClick={() => setIsModalOpen(false)}>Sair</button>
                          </div>
                        </div>
                      </ReactModal>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
        <Footer />
      </>
    </main >
  )
}