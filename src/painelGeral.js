import { useEffect, useState } from "react";
import "./index.js";
import Header from "./modules/header.js";
import supabase from "./supabase.js"
import Footer from "./modules/footer.js";
const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

export default function PainelGeral() {
    const [clientes, setClientes] = useState([])
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const { data, error } = await supabase
                    .from("clientes")
                    .select("id, nome, cpf, rua, bairro, cidade, estado, nres, aniversario, ap, celular");
                if (error) {
                    throw error;
                }
                setClientes(data.reverse());
            } catch (error) {
                console.error("Erro ao buscar clientes:", error.message);
            }
        };
        fetchClientes();
    }, []);

    return (
        <main>
            <>
                <Header/>
                <main>
                    <h2 className="page-title">Últimos cadastros:</h2>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Endereço</th>
                                <th>Cidade</th> 
                                <th>Celular</th>
                                <th>Aniversário</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes
                                .slice(0, 5)
                                .map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.nome}</td>
                                        <td>{cliente.cpf}</td>
                                        <td>{cliente.rua}, {cliente.nres} - {cliente.bairro} {cliente.ap}</td>
                                        <td>{cliente.cidade}, {cliente.estado}</td>
                                        <td>{cliente.celular}</td>
                                        <td>{formatter.format(new Date(cliente.aniversario))}</td>
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