import Header from "./modules/header";
import Footer from "./modules/footer";
import './index.css'
import supabase from "./supabase";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';


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
  const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

  //variaveis para adicionar novo cliente
  const [newCliente, setNewCliente] = useState()
  const [newCPF, setNewCPF] = useState()
  const [newRua, setNewRua] = useState()
  const [newBairro, setNewBairro] = useState()
  const [newCidade, setNewCidade] = useState()
  const [newEstado, setNewEstado] = useState()
  const [newNRES, setNewNRES] = useState()
  const [newAP, setNewAP] = useState()
  const [newTelefone, setNewTelefone] = useState()
  const [newCelular, setNewCelular] = useState()
  const [newNascimento, setNewNascimento] = useState()
  const [newInteresse, setNewInteresse] = useState()

  //variaveis para editar cliente
  const [selectedCliente, setSelectedCliente] = useState("");
  const [changeCliente, setChangeCliente] = useState()
  const [changeCPF, setChangeCPF] = useState()
  const [changeRua, setChangeRua] = useState()
  const [changeBairro, setChangeBairro] = useState()
  const [changeCidade, setChangeCidade] = useState()
  const [changeEstado, setChangeEstado] = useState()
  const [changeNRES, setChangeNRES] = useState()
  const [changeAP, setChangeAP] = useState()
  const [changeTelefone, setChangeTelefone] = useState()
  const [changeCelular, setChangeCelular] = useState()
  const [changeNascimento, setChangeNascimento] = useState()


  ReactModal.setAppElement('#root');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const { data, error } = await supabase
          .from("clientes")
          .select("id, nome, cpf, rua, bairro, cidade, estado, nres, ap, telefone, celular, aniversario");
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
  }, [changeSort, anyChange, clientes]);

  const salvarBanco = async () => {
    const { error } = await supabase
      .from('clientes')
      .insert([{
        nome: newCliente,
        cpf: newCPF,
        rua: newRua,
        bairro: newBairro,
        cidade: newCidade,
        estado: newEstado,
        nres: newNRES,
        ap: newAP,
        telefone: newTelefone,
        celular: newCelular,
        aniversario: newNascimento
      }
      ])
      .select()
    if (error) {
      console.log("Erro ao inserir clientes:", error.message)
    }
    setIsModalNewOpen(!isModalNewOpen)
  }

  const editarCliente = (cliente) => {
    setIsModalOpen(!isModalOpen)
    setSelectedCliente(cliente)
  }

  const handleAddInteresseClick = () => {
    setAddInteresse(true);
  };

  const fetchInteresses = async (clienteId) => {
    try {
      const { data, error } = await supabase
        .from('interesses')
        .select('id, interesse')
        .eq('clienteID', clienteId);

      if (error) {
        throw error;
      }
      setInteresses(data);
      console.log(data)
    } catch (error) {
      console.error("Erro ao buscar interesses:", error.message);
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
          <h1 className="titulo">Clientes:</h1>
          <p className="textNew" onClick={() => setIsModalNewOpen(!isModalNewOpen)}>Novo Cliente</p>
          <ReactModal isOpen={isModalNewOpen} >
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
                <p className="tittle">Telefone</p>
                <input type="text" name="newClienteTelefone" id="newClienteTelefone" placeholder="Telefone"
                  required value={newTelefone} onChange={(e) => setNewTelefone(e.target.value)} className="input" />
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
                <button className="buttonActionCancel" onClick={() => setIsModalNewOpen(!isModalNewOpen)}>Sair</button>
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
                <th>Telefone</th>
                <th>Celular</th>
                <th>Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.cpf}</td>
                  <td>{cliente.rua}, {cliente.nres} - {cliente.bairro} AP: {cliente.ap}</td>
                  <td>{cliente.cidade}, {cliente.estado}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.celular}</td>
                  <td>{formatter.format(new Date(cliente.aniversario))}</td>
                  <td>
                    <div className="buttonContainer">
                      <button onClick={() => verInteresses(cliente)} className="buttonActionNew">Interesses</button>
                      <ReactModal isOpen={isModalInteresseOpen} >
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
                                  <td>{interesse.interesse}</td>
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
                                            .insert([{ clienteID: selectedCliente.id, interesse: e.target.value }]);
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
                                <td>
                                  
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="buttonsSpacing">
                            <button className="buttonActionCancel" onClick={() => setIsModalInteresseOpen(false)}>Sair</button>
                          </div>
                        </div>
                      </ReactModal>
                      <button className="buttonActionChange" onClick={() => editarCliente(cliente)} >Alterar</button>
                      <button className="buttonActionCancel" onClick={async () => {
                        const confirmar = window.confirm(`Você realmente deseja excluir o cliente: ${cliente.nome}?`);
                        if (confirmar) {
                          await supabase
                            .from('clientes')
                            .delete()
                            .eq('id', cliente.id)
                          setAnyChange(!anyChange)
                        }
                      }}>Excluir</button>


                      <ReactModal isOpen={isModalOpen} >
                        <div className="modal-container">
                          <div>
                            <p className="tittle">Nome</p>
                            <input
                              type="text"
                              name="clientes"
                              id="clientes"
                              placeholder="cliente"
                              required
                              value={changeCliente !== null && changeCliente !== undefined ? changeCliente : (selectedCliente && selectedCliente.nome)}
                              onChange={(e) => setChangeCliente(e.target.value)}
                              className="input"
                            />
                          </div>
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
                              value={changeCPF !== null && changeCPF !== undefined ? changeCPF : (selectedCliente && selectedCliente.cpf)}
                              onChange={(e) => setChangeCPF(e.target.value)}
                              className="input"
                            />
                            <input
                              type="date"
                              name="aniversario"
                              id='aniversario'
                              placeholder="Nascimento"
                              required
                              value={changeNascimento !== null && changeNascimento !== undefined ? changeNascimento : (selectedCliente && selectedCliente.aniversario)}
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
                              value={changeRua !== null && changeRua !== undefined ? changeRua : (selectedCliente && selectedCliente.rua)}
                              onChange={(e) => setChangeRua(e.target.value)}
                              className="input"
                            />
                            <input
                              type="number"
                              name="numero"
                              id="numero"
                              placeholder="Numero da Residência"
                              required
                              value={changeNRES !== null && changeNRES !== undefined ? changeNRES : (selectedCliente && selectedCliente.nres)}
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
                              value={changeBairro !== null && changeBairro !== undefined ? changeBairro : (selectedCliente && selectedCliente.bairro)}
                              onChange={(e) => setChangeBairro(e.target.value)}
                              className="input"
                            />
                            <input
                              type="number"
                              name="AP"
                              id="AP"
                              placeholder="AP"
                              required
                              value={changeAP !== null && changeAP !== undefined ? changeAP : (selectedCliente && selectedCliente.ap)}
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
                              value={changeCidade !== null && changeCidade !== undefined ? changeCidade : (selectedCliente && selectedCliente.cidade)}
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
                              value={changeEstado !== null && changeEstado !== undefined ? changeEstado : (selectedCliente && selectedCliente.estado)}
                              onChange={(e) => setChangeEstado(e.target.value)}
                              className="input"
                            />
                          </div>
                          <p className="subtitle">(Atual: {selectedCliente.estado})</p>

                          <div>
                            <p className="tittle">Telefone</p>
                            <input
                              type="text"
                              name="Telefone"
                              id="Telefone"
                              placeholder="Telefone"
                              value={changeTelefone !== null && changeTelefone !== undefined ? changeTelefone : (selectedCliente && selectedCliente.telefone)}
                              onChange={(e) => setChangeTelefone(e.target.value)}
                              className="input"
                            />
                          </div>
                          <p className="subtitle">(Atual: {selectedCliente.telefone})</p>

                          <div>
                            <p className="tittle">Celular</p>
                            <input
                              type="text"
                              name="Celular"
                              id="Celular"
                              placeholder="Celular"
                              value={changeCelular !== null && changeCelular !== undefined ? changeCelular : (selectedCliente && selectedCliente.celular)}
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
                                    nome: changeCliente,
                                    cpf: changeCPF,
                                    rua: changeRua,
                                    bairro: changeBairro,
                                    cidade: changeCidade,
                                    estado: changeEstado,
                                    nres: changeNRES,
                                    ap: changeAP,
                                    telefone: changeTelefone,
                                    celular: changeCelular,
                                    aniversario: changeNascimento
                                  })
                                  .eq("id", selectedCliente.id);
                              } catch (error) {
                                console.error(error)
                              }
                              setAnyChange(!anyChange)
                              setIsModalOpen(false);
                            }}> Salvar</button>
                            <button className="buttonActionCancel" onClick={() => setIsModalOpen(!isModalOpen)}>Sair</button>
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