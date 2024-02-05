import Header from "./modules/header";
import Footer from "./modules/footer";
import './index.css'
import supabase from "./supabase";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';


export default function Funcionarios() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalNewOpen, setIsModalNewOpen] = useState(false);
    const [func, setFunc] = useState([])
    const [changeFunc, setChangeFunc] = useState()
    const [changeComissao, setChangeComissao] = useState()
    const [changeSalario, setChangeSalario] = useState()
    const [newFunc, setNewFunc] = useState()
    const [newComissao, setNewComissao] = useState()
    const [newSalario, setNewSalario] = useState()
    const [changeSort, setChangeSort] = useState(1)
    const [selectedFuncionario, setSelectedFuncionario] = useState("");
    
    ReactModal.setAppElement('#root');

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const { data, error } = await supabase
                    .from("vendedores")
                    .select("id, nome, comissao, salario");
                if (error) {
                    throw error;
                }
                if (changeSort === 1) {
                    setFunc(data.sort((a, b) => a.nome.localeCompare(b.nome)));
                } else if (changeSort === 2) {
                    setFunc(data.sort((a, b) => b.nome.localeCompare(a.nome)));
                } else if (changeSort === 3) {
                    setFunc(data.sort((a, b) => b.comissao - a.comissao));
                } else if (changeSort === 4) {
                    setFunc(data.sort((a, b) => a.comissao - b.comissao));
                } else if (changeSort === 5) {
                    setFunc(data.sort((a, b) => a.salario - b.salario));
                } else if (changeSort === 6) {
                    setFunc(data.sort((a, b) => b.salario - a.salario));
                }

            } catch (error) {
                console.error("Erro ao buscar funcionários:", error.message);
            }
        };
        fetchFuncionarios();
    })

    const salvarBanco = async () => {
        const { error } = await supabase
            .from('vendedores')
            .insert([
                { nome: newFunc, comissao: newComissao, salario: newSalario },
            ])
            .select()
        if (error) {
            console.log("Erro ao inserir vendedores:", error.message)
        }
        setIsModalNewOpen(!isModalNewOpen)
        setNewComissao()
        setNewFunc()
    }

    const editarFuncionario = (funcionario) => {
        setIsModalOpen(!isModalOpen)
        setSelectedFuncionario(funcionario)
    }

    return (
        <main>
            <>
                <Header />
                <main>
                    <h1 className="titulo">Funcionários:</h1>
                    <p className="textNew" onClick={() => setIsModalNewOpen(!isModalNewOpen)}>Novo Funcionário</p>
                    <ReactModal isOpen={isModalNewOpen} >
                        <div className="modal-container">
                            <div>
                                <p className="tittle">Nome</p>
                                <input type="text" name="newFunc" id="newFunc" placeholder="Funcionario" required value={newFunc} onChange={(e) => setNewFunc(e.target.value)} className="input" />
                            </div>

                            <div>
                                <p className="tittle">Comissão</p>
                                <input type="text" name="newComissao" id="newComissao" placeholder="Comissão" required value={newComissao} onChange={(e) => setNewComissao(e.target.value)} className="input" />
                            </div>
                            <div>
                                <p className="tittle">Salário</p>
                                <input type="text" name="newSalario" id="newSalario" placeholder="Salário" required value={newSalario} onChange={(e) => setNewSalario(e.target.value)} className="input" />
                            </div>


                            <div className="buttonsSpacing">
                                <button className="buttonActionNew" onClick={() => salvarBanco()}>Adicionar</button>
                                <button className="buttonActionCancel" onClick={() => setIsModalNewOpen(!isModalNewOpen)}>Sair</button>
                            </div>
                        </div>
                    </ReactModal>

                    <table>
                        <thead>
                            <th className="pointer" onClick={() => {
                                if (changeSort !== 1) {
                                    setChangeSort(1);
                                } else if (changeSort === 1) {
                                    setChangeSort(2);
                                }
                            }}>
                                Nome
                            </th>
                            <th className="pointer" onClick={() => {
                                if (changeSort !== 3) {
                                    setChangeSort(3);
                                } else if (changeSort === 3) {
                                    setChangeSort(4);
                                }
                            }}>
                                Comissão
                            </th>
                            <th className="pointer" onClick={() => {
                                if (changeSort !== 5) {
                                    setChangeSort(5);
                                } else if (changeSort === 5) {
                                    setChangeSort(6);
                                }
                                console.log(changeSort)
                            }}>
                                Salário
                            </th>
                            <th>
                                Ações
                            </th>
                        </thead>
                        <tbody>
                            {func.map((funcionario) => (
                                <tr key={funcionario.id}>
                                    <td>
                                        {funcionario.nome}
                                    </td>
                                    <td>
                                        {funcionario.comissao.toFixed(2)}%
                                    </td>
                                    <td>
                                        R$ {funcionario.salario.toFixed(2)}
                                    </td>
                                    <td>
                                        <div className="buttonContainer">
                                            <button className="buttonActionChange" onClick={() => editarFuncionario(funcionario)} >Alterar</button>
                                            <button className="buttonActionCancel" onClick={async () => {
                                                const confirmar = window.confirm(`Você realmente deseja excluir o funcionário: ${funcionario.nome}?`);
                                                if (confirmar) {
                                                    await supabase
                                                        .from('vendedores')
                                                        .delete()
                                                        .eq('id', funcionario.id);
                                                }
                                            }}>Excluir</button>
                                            <ReactModal isOpen={isModalOpen} >
                                                <div className="modal-container">
                                                    <div>
                                                        <p className="tittle">Nome</p>
                                                        <input
                                                            type="text"
                                                            name="func"
                                                            id="func"
                                                            placeholder="Funcionario"
                                                            required
                                                            value={changeFunc || (selectedFuncionario && selectedFuncionario.nome)}
                                                            onChange={(e) => setChangeFunc(e.target.value)}
                                                            className="input"
                                                        />
                                                    </div>
                                                    <p className="subtitle">(Atual: {selectedFuncionario.nome})</p>

                                                    <div>
                                                        <p className="tittle">Comissão</p>
                                                        <input
                                                            type="text"
                                                            name="comissao"
                                                            id="comissao"
                                                            placeholder="Comissão"
                                                            required
                                                            value={changeComissao || (selectedFuncionario && selectedFuncionario.comissao)}
                                                            onChange={(e) => setChangeComissao(e.target.value)}
                                                            className="input"
                                                        />
                                                    </div>
                                                    <p className="subtitle">(Atual: {selectedFuncionario.comissao}%)</p>
                                                    <div>
                                                        <p className="tittle">Salario</p>
                                                        <input
                                                            type="text"
                                                            name="salario"
                                                            id="salario"
                                                            placeholder="Salário"
                                                            required
                                                            value={changeSalario || (selectedFuncionario && selectedFuncionario.salario)}
                                                            onChange={(e) => setChangeSalario(e.target.value)}
                                                            className="input"
                                                        />
                                                    </div>
                                                    <p className="subtitle">(Atual: R$ {selectedFuncionario.salario})</p>
                                                    <div className="buttonsSpacing">
                                                        <button className="buttonActionNew" onClick={async () => {
                                                            await supabase
                                                                .from("vendedores")
                                                                .update({ nome: changeFunc, comissao: changeComissao, salario: changeSalario })
                                                                .eq("id", funcionario.id);
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
                    <table className="gap">
                        <thead>
                            <th>
                                Total de salário:
                            </th>
                            <th>Total de comissão:</th>
                        </thead>
                        <tbody>
                            <tr >
                                <td>
                                    R$ {func.reduce((total, funcionario) => total + funcionario.salario, 0).toFixed(2)}
                                </td>
                                <td>
                                    R$ {comissao}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </main>
                <Footer />
            </>
        </main >
    )
}