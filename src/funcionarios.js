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
    const [anyChange, setAnyChange] = useState(false)

    ReactModal.setAppElement('#root');

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const { data: funcionarios, error: funcionariosError } = await supabase
                    .from("vendedores")
                    .select("id, nome, comissao, salario");

                const { data: vendas, error: vendasError } = await supabase
                    .from('vendas')
                    .select('valorTotal, vendedorID');

                if (funcionariosError) {
                    throw funcionariosError;
                }

                if (vendasError) {
                    throw vendasError;
                }

                const funcionariosWithVendas = funcionarios.map((funcionario) => {
                    const vendasDoFuncionario = vendas.filter((venda) => venda.vendedorID === funcionario.id);
                    const totalVendas = vendasDoFuncionario.reduce((total, venda) => total + venda.valorTotal, 0);
                    return {
                        ...funcionario,
                        totalVendas,
                    };
                });

                if (changeSort === 1) {
                    setFunc(funcionariosWithVendas.sort((a, b) => a.nome.localeCompare(b.nome)));
                } if (changeSort === 2) {
                    setFunc(funcionariosWithVendas.sort((a, b) => b.nome.localeCompare(a.nome)));
                } if (changeSort === 3) {
                    setFunc(funcionariosWithVendas.sort((a, b) => a.comissao - b.comissao));
                } if (changeSort === 4) {
                    setFunc(funcionariosWithVendas.sort((a, b) => b.comissao - a.comissao));
                } if (changeSort === 5) {
                    setFunc(funcionariosWithVendas.sort((a, b) => a.salario - b.salario));
                } if (changeSort === 6) {
                    setFunc(funcionariosWithVendas.sort((a, b) => b.salario - a.salario));
                }
            } catch (error) {
                console.error("Erro ao buscar funcionários:", error.message);
            }
        };
        fetchFuncionarios();
    }, [changeSort, anyChange])

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
        setNewSalario()
        setNewFunc()
        setAnyChange(!anyChange)
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
                                <input type="text" name="newFunc" id="newFunc" placeholder="Funcionario"
                                    required value={newFunc} onChange={(e) => setNewFunc(e.target.value)} className="input" />
                            </div>

                            <div>
                                <p className="tittle">Comissão</p>
                                <input type="text" name="newComissao" id="newComissao"
                                    placeholder="Comissão" required value={newComissao}
                                    onChange={(e) => setNewComissao(e.target.value)} className="input" />
                            </div>
                            <div>
                                <p className="tittle">Salário</p>
                                <input type="text" name="newSalario" id="newSalario" placeholder="Salário"
                                    required value={newSalario} onChange={(e) => setNewSalario(e.target.value)} className="input" />
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
                            <th className="noClick">
                                Total em vendas:
                            </th>
                            <th className="noClick">
                                Total em comissão:
                            </th>
                            <th className="pointer" onClick={() => {
                                if (changeSort !== 5) {
                                    setChangeSort(5);
                                } else if (changeSort === 5) {
                                    setChangeSort(6);
                                }
                            }}>
                                Salário
                            </th>
                            <th className="noClick">
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
                                        R$ {funcionario.totalVendas.toFixed(2)}
                                    </td>
                                    <td>
                                        R$ {(funcionario.totalVendas * (funcionario.comissao / 100)).toFixed(2)}
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
                                                    setAnyChange(!anyChange)
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
                                                            value={changeFunc !== undefined && changeFunc !== null ? changeFunc : (selectedFuncionario && selectedFuncionario.nome)}
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
                                                            value={changeComissao !== undefined && changeComissao !== null ? changeComissao : (selectedFuncionario && selectedFuncionario.comissao)}
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
                                                            value={changeSalario !== undefined && changeSalario !== null ? changeSalario : (selectedFuncionario && selectedFuncionario.salario)}
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
                                                                .eq("id", selectedFuncionario.id);
                                                            setIsModalOpen(false);
                                                            setAnyChange(!anyChange)
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
                            <th className="noClick">
                                Total de salário:
                            </th>
                            <th className="noClick">Total de comissão:</th>
                            <th className="noClick">Total a pagar:</th>
                        </thead>
                        <tbody>
                            <tr >
                                <td>
                                    R$ {func.reduce((total, funcionario) => total + funcionario.salario, 0).toFixed(2)}
                                </td>
                                <td>
                                    R$ {func.reduce((total, funcionario) => total + funcionario.totalVendas * (funcionario.comissao / 100), 0).toFixed(2)}
                                </td>
                                <td>
                                    R$ {func.reduce((total, funcionario) => total + funcionario.salario + funcionario.totalVendas * (funcionario.comissao / 100), 0).toFixed(2)}
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