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
    const [changeSort, setChangeSort] = useState(1)

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const { data, error } = await supabase
                    .from("vendedores")
                    .select("id, nome, comissao");
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
                { nome: changeFunc, comissao: changeComissao },
            ])
            .select()
        if (error) {
            console.log("Erro ao inserir vendedores:", error.message)
        }
        setIsModalNewOpen(!isModalNewOpen)
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
                                <input type="text" name="func" id="func" placeholder="Funcionario" required value={changeFunc} onChange={(e) => setChangeFunc(e.target.value)} className="input" />
                            </div>

                            <div>
                                <p className="tittle">Comissão</p>
                                <input type="text" name="comissao" id="comissao" placeholder="Comissão" required value={changeComissao} onChange={(e) => setChangeComissao(e.target.value)} className="input" />
                            </div>

                            <div className="buttonsSpacing">
                                <button className="buttonActionNew" onClick={() => salvarBanco()}>Adicionar</button>
                                <button className="buttonActionCancel" onClick={() => setIsModalNewOpen(!isModalNewOpen)}>Sair</button>
                            </div>
                        </div>
                    </ReactModal>

                    <table>
                        <thead>
                            <th onClick={() => {
                                if (changeSort === 2 || changeSort === 3 || changeSort === 4) {
                                    setChangeSort(1);
                                } else if (changeSort === 1) {
                                    setChangeSort(2);
                                }
                            }} className="pointer">
                                Nome
                            </th>
                            <th onClick={() => {
                                if (changeSort === 1 || changeSort === 2 || changeSort === 4) {
                                    setChangeSort(3);
                                } else if (changeSort === 3) {
                                    setChangeSort(4);
                                }
                            }} className="pointer">
                                Comissão
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
                                        {funcionario.comissao}%
                                    </td>
                                    <td>
                                        <div className="buttonContainer">
                                            <button className="buttonActionChange" onClick={() => setIsModalOpen(!isModalOpen)}>Alterar</button>
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
                                                        <input type="text" name="func" id="func" placeholder="Funcionario" required value={changeFunc || funcionario.nome} onChange={(e) => setChangeFunc(e.target.value)} className="input" />
                                                    </div>
                                                    <p className="subtitle">(Atual: {funcionario.nome})</p>

                                                    <div>
                                                        <p className="tittle">Comissão</p>
                                                        <input type="text" name="comissao" id="comissao" placeholder="Comissão" required value={changeComissao || funcionario.changeComissao} onChange={(e) => setChangeComissao(e.target.value)} className="input" />
                                                    </div>
                                                    <p className="subtitle">(Atual: {funcionario.comissao}%)</p>

                                                    <div className="buttonsSpacing">
                                                        <button className="buttonActionNew" onClick={async () => {
                                                            await supabase
                                                                .from("vendedores")
                                                                .update({ nome: changeFunc, comissao: changeComissao })
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
                </main>
                <Footer />
            </>
        </main >
    )
}