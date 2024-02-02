import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.js";
import Header from "./modules/header.js";
import supabase from "./supabase.js"
import Footer from "./modules/footer.js";
import baixados from "./sources/baixados.png"

export default function PainelGeral() {
    const formatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const navigate = useNavigate()
    const [clientes, setClientes] = useState([])
    const [vendas, setVendas] = useState([])
    const [clientNames, setClientNames] = useState([]);
    const [vendedores, setVendedores] = useState([]);

    const CheckLogin = async () => {
        const check = await supabase.auth.getSession();
        if (check.data.session == null) {
            navigate('/');
        }
    }

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const { data, error } = await supabase
                    .from("clientes")
                    .select("id, nome, cpf, rua, bairro, cidade, estado, nres, ap, telefone, celular");
                if (error) {
                    throw error;
                }
                setClientes(data.reverse());
            } catch (error) {
                console.error("Erro ao buscar clientes:", error.message);
            }
        };
        const fetchVendas = async () => {
            try {
                const { data, error } = await supabase
                    .from("vendas")
                    .select("id, clienteID, vendedorID, valorTotal, formaPagamento, parcelas, valorParcelas, itens, totalpago, data, vencimento ");
                if (error) {
                    throw error;
                }
                setVendas(data.reverse());
                console.log(vendas)

                const clientIDs = data.map((venda) => venda.clienteID);
                const { data: clientData, error: clientError } = await supabase
                    .from("clientes")
                    .select("id, nome")
                    .in("id", clientIDs);
                if (clientError) {
                    throw clientError;
                }
                const clientNamesMap = {};
                clientData.forEach((cliente) => {
                    clientNamesMap[cliente.id] = cliente.nome;
                });
                setClientNames(clientNamesMap);

                const vendedorIDs = data.map((venda) => venda.vendedorID);
                const { data: vendedorData, error: vendedorError } = await supabase
                    .from("vendedores")
                    .select("id, nome")
                    .in("id", vendedorIDs);
                if (vendedorError) {
                    throw vendedorError;
                }
                const vendedorNamesMap = {};
                vendedorData.forEach((vendedor) => {
                    vendedorNamesMap[vendedor.id] = vendedor.nome;
                });
                setVendedores(vendedorNamesMap);
            } catch (error) {
                console.error("Erro ao buscar vendas:", error.message);
            }
        };
        fetchClientes();
        fetchVendas();
        CheckLogin();
    }, []);


    return (
        <main>
            <>
                <Header/>

                <main>
                    <h1 className="titulo">Últimas Vendas:</h1>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Vendedor</th>
                                <th>F. Pagamento</th>
                                <th>Parcelas</th>
                                <th>Valor Total</th>
                                <th>Data / Vencimento</th>
                                <th>Pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendas
                                .slice(0, 5)
                                .map((venda) => (
                                    <tr key={venda.id}>
                                        <td>{clientNames[venda.clienteID]}</td>
                                        <td>{vendedores[venda.vendedorID]}</td>
                                        <td>{venda.formaPagamento}</td>
                                        <td>{venda.parcelas}x {venda.valorParcelas}</td>
                                        <td>{venda.valorTotal}</td>
                                        <td>{formatter.format(vendas.data)}, {formatter.format(vendas.vencimento)}</td>
                                        <td>{venda.totalpago ? "Sim" : "Não"}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    <h1 className="titulo">Últimos cadastros:</h1>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Endereço</th>
                                <th>Cidade</th>
                                <th>Telefone</th>
                                <th>Celular</th>
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
                                        <td>{cliente.telefone}</td>
                                        <td>{cliente.celular}</td>
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